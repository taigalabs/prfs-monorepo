use crate::envs::ENVS;
use crate::geth::{
    GetBalanceRequest, GetBlockByNumberRequest, GetTransactionReceiptRequest, GethClient,
};
use crate::TreeMakerError;
use clap::ArgMatches;
use prfs_db_interface::database2::Database2;
use prfs_db_interface::db_apis;
use prfs_db_interface::entities::EthAccount;
use prfs_db_interface::sqlx::{Pool, Postgres, Transaction};
use rust_decimal::Decimal;
use std::collections::BTreeMap;
use std::time::Duration;

const MAX_CONSEQ_ERR_COUNT: usize = 10;

pub async fn scan_ledger(_sub_matches: &ArgMatches) {
    let geth_endpoint: String = ENVS.geth_endpoint.to_string();
    let geth_client = GethClient::new(geth_endpoint);

    let pg_endpoint = &ENVS.postgres_endpoint;
    let pg_username = &ENVS.postgres_username;
    let pg_pw = &ENVS.postgres_pw;
    let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
        .await
        .unwrap();

    let pool = &db2.pool;
    let mut tx = pool.begin().await.unwrap();

    scan_ledger_accounts(geth_client, pool, &mut tx)
        .await
        .unwrap();

    tx.commit().await.unwrap();
}

async fn scan_ledger_accounts(
    geth_client: GethClient,
    _pool: &Pool<Postgres>,
    tx: &mut Transaction<'_, Postgres>,
) -> Result<(), TreeMakerError> {
    let balance_bucket_capacity = ENVS.scan_balance_bucket_capacity;
    let scan_update_on_conflict = ENVS.scan_update_on_conflict;
    let scan_interval = ENVS.scan_interval;
    let start_block: u64 = ENVS.scan_start_block;
    let end_block: u64 = ENVS.scan_end_block;

    tracing::info!(
        "Scanning ledger accounts, start_block: {}, end_block: {}, scan_interval: {}, \
        update_on_conflict: {}",
        start_block,
        end_block,
        scan_interval,
        scan_update_on_conflict,
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

            break;
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
            // println!("balances: {:#?}", balances);

            match db_apis::insert_eth_accounts(tx, balances, scan_update_on_conflict).await {
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
        // println!("44 balances: {:#?}", balances);
        tracing::info!(
            "Writing (last) remaining balances, balances_count: {}, end block_no (excl): {}",
            balances.len(),
            end_block
        );

        db_apis::insert_eth_accounts(tx, balances, scan_update_on_conflict).await?;
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
