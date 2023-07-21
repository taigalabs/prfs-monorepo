use dotenv::dotenv;
use hyper::Server;
use prfs_backend::{router, seed::SeedJson, BackendError};
use prfs_db_interface::database::Database;
use routerify::RouterService;
use std::{net::SocketAddr, path::PathBuf};

#[tokio::main]
async fn main() -> Result<(), BackendError> {
    println!("Starting backend server...");

    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let local_assets = load_local_assets(&curr_dir)?;

    dotenv().expect("dotenv failed");

    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT").expect("POSTGRES_ENDPOINT missing");
    let pg_pw = std::env::var("POSTGRES_PW").expect("POSTGRES_PW missing");
    let db = Database::connect(pg_endpoint, pg_pw).await?;

    let router = router::make_router(db).expect("make_router fail");
    let service = RouterService::new(router).expect("router service init fail");

    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));
    let server = Server::bind(&addr).serve(service);

    println!("Prfs backend is running on: {}", addr);
    if let Err(err) = server.await {
        eprintln!("Server error: {}", err);
    }

    Ok(())
}

fn load_local_assets(curr_dir: &PathBuf) -> Result<SeedJson, BackendError> {
    let seed_json_path = curr_dir.join("seed.json");
    let seed_json = std::fs::read(&seed_json_path).unwrap();
    let seed_json: SeedJson = serde_json::from_slice(&seed_json)?;

    Ok(seed_json)
}
