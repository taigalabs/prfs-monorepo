use prfs_api_server::seed;
use prfs_api_server::seed::db::Endpoint;
use prfs_api_server::ApiServerError;

#[tokio::main]
async fn main() -> Result<(), ApiServerError> {
    println!("Starting backend seeding...");

    let db = seed::db::connect_db(Endpoint::Dev).await;

    seed::write::upload(&db).await;

    Ok(())
}
