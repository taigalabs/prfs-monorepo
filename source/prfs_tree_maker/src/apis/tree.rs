use crate::{geth::GethClient, TreeMakerError};
use prfs_db_interface::Database;

pub async fn run(geth_client: GethClient, db: Database) -> Result<(), TreeMakerError> {
    // process_genesis_block_accounts(geth_client, db).await?;

    Ok(())
}

