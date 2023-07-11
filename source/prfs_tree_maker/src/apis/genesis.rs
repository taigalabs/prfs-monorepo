use crate::geth::{GetBalanceRequest, GethClient};
use crate::TreeMakerError;
use prfs_db_interface::database::Database;
use prfs_db_interface::models::Account;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, HashMap};
use std::fs::{self};
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug)]
struct GenesisEntry {
    wei: String,
}

pub async fn run() -> Result<(), TreeMakerError> {
    let geth_client = GethClient::new()?;

    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT")?;
    let pg_pw = std::env::var("POSTGRES_PW")?;

    let db = Database::connect(pg_endpoint, pg_pw).await?;

    process_genesis_block_accounts(geth_client, db).await?;

    Ok(())
}

async fn process_genesis_block_accounts(
    geth_client: GethClient,
    db: Database,
) -> Result<(), TreeMakerError> {
    let project_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let genesis_block_path = project_root.join("data/genesis_block.json");

    println!("genesis_block_path: {:?}", genesis_block_path);

    let data = fs::read_to_string(&genesis_block_path)?;
    let genesis_block: HashMap<String, GenesisEntry> =
        serde_json::from_str(&data).expect("JSON does not have correct format.");

    let mut balances = BTreeMap::new();
    for (idx, (addr, _)) in genesis_block.iter().enumerate() {
        let addr = format!("0x{}", addr);

        let resp = geth_client
            .eth_getBalance(GetBalanceRequest(&addr, "latest"))
            .await?;

        if let Some(r) = resp.result {
            let wei_str = r.strip_prefix("0x").expect("wei should contain 0x");
            let wei = Decimal::from_str_radix(wei_str, 16).unwrap();
            let acc = Account {
                addr: addr.to_string(),
                wei,
            };

            balances.insert(addr, acc);

            if idx % 200 == 0 {
                let rows_updated = db.insert_accounts(balances, false).await?;
                println!("idx: {}, rows_updated: {}", idx, rows_updated);

                balances = BTreeMap::new();
            }
        }
    }

    Ok(())
}
