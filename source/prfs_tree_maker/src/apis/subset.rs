use crate::{geth::GethClient, TreeMakerError};
use prfs_db_interface::Database;

pub async fn run() -> Result<(), TreeMakerError> {
    // let geth_client = GethClient::new()?;
    let db = Database::connect().await?;
    println!("run");
    // process_genesis_block_accounts(geth_client, db).await?;

    Ok(())
}
