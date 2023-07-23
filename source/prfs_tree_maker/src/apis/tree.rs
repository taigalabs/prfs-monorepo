use crate::{geth::GethClient, TreeMakerError};
use prfs_db_interface::database::Database;

pub async fn run() -> Result<(), TreeMakerError> {
    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT")?;
    let pg_pw = std::env::var("POSTGRES_PW")?;
    let db = Database::connect(pg_endpoint, pg_pw).await?;

    println!("run");

    Ok(())
}
