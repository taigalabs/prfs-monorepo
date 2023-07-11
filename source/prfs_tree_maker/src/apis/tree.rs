use crate::{geth::GethClient, TreeMakerError};
use prfs_db_interface::Database;

pub async fn run(db: Database) -> Result<(), TreeMakerError> {
    println!("run");
    // process_genesis_block_accounts(geth_client, db).await?;

    Ok(())
}

