use colored::Colorize;
use hyper::Server;
use hyper_staticfile::Static;
use prfs_asset_server::state::ServerState;
use prfs_asset_server::{local, AssetServerError};
use prfs_asset_server::{paths::PATHS, router::make_router};
use routerify::RouterService;
use std::net::SocketAddr;

#[tokio::main]
async fn main() -> Result<(), AssetServerError> {
    println!("{} {}", "Starting".green(), env!("CARGO_PKG_NAME"),);

    let _circuit_build_json = local::setup_local_assets();

    let static_serve = Static::new(&PATHS.assets);
    let server_state = ServerState { static_serve };
    let router = make_router(server_state);

    let service = RouterService::new(router).unwrap();
    let addr: SocketAddr = ([127, 0, 0, 1], 4010).into();
    let server = Server::bind(&addr).serve(service);

    println!("Server is running on: {}", addr);

    if let Err(err) = server.await {
        eprintln!("Server error: {}", err);
    }

    Ok(())
}
