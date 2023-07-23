use colored::Colorize;
use dotenv::dotenv;
use hyper::Server;
use prfs_api_server::state::ServerState;
use prfs_api_server::{router, ApiServerError};
use prfs_circuits_circom::BuildJson;
use prfs_db_interface::database::Database;
use routerify::RouterService;
use std::sync::Arc;
use std::{net::SocketAddr, path::PathBuf};

#[tokio::main]
async fn main() -> Result<(), ApiServerError> {
    println!("Initializing {}...", env!("CARGO_PKG_NAME"));

    dotenv().expect("dotenv failed");

    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    println!("manifest_dir: {:?}", manifest_dir);

    let build_json = require_local_assets();

    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT").expect("POSTGRES_ENDPOINT missing");
    let pg_pw = std::env::var("POSTGRES_PW").expect("POSTGRES_PW missing");
    let db = Database::connect(pg_endpoint, pg_pw).await?;

    let server_state = Arc::new(ServerState {
        db: Arc::new(db),
        build_json,
    });

    let router = router::make_router(server_state).expect("make_router fail");
    let service = RouterService::new(router).expect("router service init fail");

    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));
    let server = Server::bind(&addr).serve(service);

    println!("Prfs backend is running on: {}", addr);
    if let Err(err) = server.await {
        eprintln!("Server error: {}", err);
    }

    Ok(())
}

fn require_local_assets() -> BuildJson {
    let build_json = prfs_circuits_circom::access::read_build_json();

    for circuit in &build_json.circuit_builds {
        println!("[local] {} {}", "Loading".green(), circuit.name);
    }

    build_json
}
