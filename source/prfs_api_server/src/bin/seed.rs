use prfs_api_server::{local, ApiServerError};

#[tokio::main]
async fn main() -> Result<(), ApiServerError> {
    println!("Starting backend seeding...");

    let build_json = local::require_local_assets();

    Ok(())
}
