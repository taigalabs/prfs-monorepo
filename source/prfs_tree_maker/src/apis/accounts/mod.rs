mod genesis;
mod scan;

use crate::{geth::GethClient, TreeMakerError};
use prfs_db_interface::db::Database;

pub async fn get_accounts(geth_client: GethClient, db: Database) -> Result<(), TreeMakerError> {
    // genesis::run(geth_client, db).await?;
    scan::run(geth_client, db).await?;

    Ok(())
}
