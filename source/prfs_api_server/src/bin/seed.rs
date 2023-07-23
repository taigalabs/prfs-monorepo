use prfs_api_server::{local, ApiServerError};

#[tokio::main]
async fn main() -> Result<(), ApiServerError> {
    println!("Starting backend seeding...");

    local::run_seed();

    Ok(())
}
