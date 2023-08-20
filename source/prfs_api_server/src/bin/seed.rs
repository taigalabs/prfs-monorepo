use prfs_api_server::seed;
use prfs_api_server::ApiServerError;

#[tokio::main]
async fn main() -> Result<(), ApiServerError> {
    println!("Starting backend seeding...");

    seed::upload().await;

    Ok(())
}
