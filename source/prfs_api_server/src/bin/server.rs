use colored::Colorize;
use hyper::Server;
use prfs_api_server::envs::ENVS;
use prfs_api_server::state::ServerState;
use prfs_api_server::{local, router, ApiServerError};
use prfs_db_interface::database2::Database2;
use routerify::RouterService;
use std::sync::Arc;
use std::{net::SocketAddr, path::PathBuf};

#[tokio::main]
async fn main() -> Result<(), ApiServerError> {
    println!("{} {}...", "Starting".green(), env!("CARGO_PKG_NAME"));

    ENVS.check();

    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    println!("manifest_dir: {:?}", manifest_dir);

    // let local_assets = local::load_local_assets();

    let pg_endpoint = &ENVS.postgres_endpoint;
    let pg_username = &ENVS.postgres_username;
    let pg_pw = &ENVS.postgres_pw;

    let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
        .await
        .unwrap();

    let server_state = Arc::new(ServerState { db2 });

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
