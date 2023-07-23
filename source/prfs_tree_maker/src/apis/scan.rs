use crate::geth::{
    GetBalanceRequest, GetBlockByNumberRequest, GetTransactionReceiptRequest, GethClient,
};
use crate::TreeMakerError;
use prfs_db_interface::database::Database;
use prfs_db_interface::models::EthAccount;
use rust_decimal::Decimal;
use std::collections::BTreeMap;
use std::time::Duration;

const MAX_CONSEQ_ERR_COUNT: usize = 10;

pub async fn run() -> Result<(), TreeMakerError> {
    let geth_client = GethClient::new()?;

    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT")?;
    let pg_pw = std::env::var("POSTGRES_PW")?;
    let db = Database::connect(pg_endpoint, pg_pw).await?;

    let balance_bucket_capacity = {
        let s: usize = std::env::var("SCAN_BALANCE_BUCKET_CAPACITY")
            .expect("env var SCAN_BALANCE_BUCKET_CAPACITY missing")
            .parse()
            .unwrap();
        s
    };

    let scan_update_on_conflict = {
        let s: String = std::env::var("SCAN_UPDATE_ON_CONFLICT")
            .expect("env var SCAN_UPDATE_ON_CONFLICT missing")
            .parse()
            .unwrap();

        match s.as_str() {
            "true" => true,
            "false" => false,
            _ => panic!("Invalid POSTGRES_UPDATE_ON_CONFLICT"),
        }
    };

    let scan_interval = {
        let s: u64 = std::env::var("SCAN_INTERVAL")
            .expect("env var SCAN_INTERVAL missing")
            .parse()
            .unwrap();
        s
    };

    scan_ledger_accounts(
        geth_client,
        db,
        scan_update_on_conflict,
        scan_interval,
        balance_bucket_capacity,
    )
    .await?;

    Ok(())
}

async fn scan_ledger_accounts(
    geth_client: GethClient,
    db: Database,
    update_on_conflict: bool,
    scan_interval: u64,
    balance_bucket_capacity: usize,
) -> Result<(), TreeMakerError> {
    let (start_block, end_block) = {
        let sb: u64 = std::env::var("START_BLOCK")
            .expect("env var START_BLOCK missing")
            .parse()
            .unwrap();
        let eb: u64 = std::env::var("END_BLOCK")
            .expect("env var END_BLOCK missing")
            .parse()
            .unwrap();

        (sb, eb)
    };

    println!(
        "Scanning ledger accounts, start_block: {}, end_block: {}, scan_interval: {}, \
        update_on_conflict: {}",
        start_block, end_block, scan_interval, update_on_conflict,
    );

    let mut balances = BTreeMap::<String, EthAccount>::new();

    let mut conseq_err_count = 0;
    for no in start_block..end_block {
        if conseq_err_count > MAX_CONSEQ_ERR_COUNT {
            tracing::error!(
                "Terminating program because of too many errors, count: {}",
                conseq_err_count
            );

            return Ok(());
        }

        if no % 30 == 0 {
            tracing::info!(
                "Block processing now at: {}, sleeping for short duration to resume",
                no
            );

            tokio::time::sleep(Duration::from_millis(scan_interval)).await;
        }

        let b_no = format!("0x{:x}", no);

        tracing::info!(
            "processing block: {} ({}), #balance in bucket: {}",
            b_no,
            no,
            balances.len()
        );

        let resp = geth_client
            .eth_getBlockByNumber(GetBlockByNumberRequest(&b_no, true))
            .await?;

        let result = if let Some(r) = resp.result {
            r
        } else {
            let msg = format!("Get block response failed, block_no: {}", no);
            tracing::error!("{}", msg);

            return Err(msg.into());
        };

        // miner
        match get_balance_and_add_item(&geth_client, &mut balances, result.miner.to_string()).await
        {
            Ok(_) => {
                conseq_err_count = 0;
            }
            Err(_) => {
                conseq_err_count += 1;
                tokio::time::sleep(Duration::from_millis(1000)).await;
            }
        }

        for tx in result.transactions {
            // from
            match get_balance_and_add_item(&geth_client, &mut balances, tx.from.to_string()).await {
                Ok(_) => {
                    conseq_err_count = 0;
                }
                Err(_) => {
                    conseq_err_count += 1;
                    tokio::time::sleep(Duration::from_millis(1000)).await;
                }
            }

            match tx.to {
                Some(to) => {
                    // to
                    match get_balance_and_add_item(&geth_client, &mut balances, to.to_string())
                        .await
                    {
                        Ok(_) => {
                            conseq_err_count = 0;
                        }
                        Err(_) => {
                            conseq_err_count += 1;
                            tokio::time::sleep(Duration::from_millis(1000)).await;
                        }
                    }
                }
                None => {
                    match &geth_client
                        .eth_getTransactionReceipt(GetTransactionReceiptRequest(&tx.hash))
                        .await
                    {
                        Ok(resp) => {
                            // println!("get transaction receipt resp: {:?}", resp);

                            if let Some(r) = &resp.result {
                                if let Some(contract_addr) = &r.contractAddress {
                                    // contract
                                    match get_balance_and_add_item(
                                        &geth_client,
                                        &mut balances,
                                        contract_addr.to_string(),
                                    )
                                    .await
                                    {
                                        Ok(_) => {
                                            conseq_err_count = 0;
                                        }
                                        Err(_) => {
                                            conseq_err_count += 1;
                                            tokio::time::sleep(Duration::from_millis(1000)).await;
                                        }
                                    }
                                }
                            }
                        }
                        Err(_) => {
                            conseq_err_count += 1;
                            tokio::time::sleep(Duration::from_millis(1000)).await;
                        }
                    };
                }
            };
        }

        let balances_count = balances.len();
        if balances.len() >= balance_bucket_capacity {
            match db.insert_accounts(balances, update_on_conflict).await {
                Ok(r) => {
                    tracing::info!(
                        "Writing balances, balances_count: {}, block_no: {}, rows_affected: {}",
                        balances_count,
                        no,
                        r
                    );
                }
                Err(err) => {
                    let msg = format!("Balance insertion failed, err: {}, block_no: {}", err, no);
                    tracing::error!(msg);

                    return Err(msg.into());
                }
            }

            balances = BTreeMap::new();
        }
    }

    if balances.len() > 0 {
        tracing::info!(
            "Writing (last) remaining balances, balances_count: {}, end block_no (excl): {}",
            balances.len(),
            end_block
        );

        db.insert_accounts(balances, update_on_conflict).await?;
    } else {
        tracing::info!(
            "Balances are empty. Closing 'scan', balances_count: {}, end block_no (excl): {}",
            balances.len(),
            end_block
        );
    }

    Ok(())
}

async fn get_balance_and_add_item(
    geth_client: &GethClient,
    addresses: &mut BTreeMap<String, EthAccount>,
    addr: String,
) -> Result<(), TreeMakerError> {
    if addresses.contains_key(&addr) {
        // println!("skip, {}", addr);

        return Ok(());
    } else {
        let resp = match geth_client
            .eth_getBalance(GetBalanceRequest(&addr, "latest"))
            .await
        {
            Ok(r) => r,
            Err(err) => {
                let msg = format!("Geth get balance failed, err: {}, addr: {}", err, addr);
                tracing::error!("{}", msg);

                return Err(msg.into());
            }
        };

        if let Some(r) = resp.result {
            let wei = {
                let wei_str = r
                    .strip_prefix("0x")
                    .expect("wei str should contain 0x")
                    .to_string();

                match Decimal::from_str_radix(&wei_str, 16) {
                    Ok(u) => u,
                    Err(err) => {
                        let msg = format!(
                            "u128 conversion failed, err: {}, wei_str: {}, addr: {}",
                            err, wei_str, addr
                        );

                        tracing::error!("{}", msg);

                        return Err(msg.into());
                    }
                }
            };

            let acc = EthAccount {
                addr: addr.to_string(),
                wei,
            };

            addresses.insert(addr, acc);
        }
    }

    Ok(())
}
