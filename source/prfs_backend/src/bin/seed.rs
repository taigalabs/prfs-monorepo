use prfs_backend::BackendError;
use prfs_db_interface::database::Database;

#[tokio::main]
async fn main() -> Result<(), BackendError> {
    println!("Starting backend seeding...");

    Ok(())
}
