use shy_api_server::seed;
// use shy_api_server::seed::db::Endpoint;
use shy_api_server::ApiServerError;

#[tokio::main]
async fn main() -> Result<(), ApiServerError> {
    println!("Starting backend seeding...");

    // let db = seed::db::connect_db(Endpoint::Dev).await;

    // seed::upload::upload(&db).await;

    Ok(())
}

fn upload() {}
