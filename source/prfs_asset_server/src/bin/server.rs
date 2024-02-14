use colored::Colorize;
// use hyper::Server;
use hyper_staticfile::Static;
use prfs_asset_server::envs::ENVS;
use prfs_asset_server::paths::PATHS;
// use prfs_asset_server::server::{make_router, ServerState};
use prfs_asset_server::{local, AssetServerError};
// use routerify::RouterService;
use prfs_asset_server::server;
use std::net::SocketAddr;
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<(), AssetServerError> {
    println!("{} {}", "Starting".green(), env!("CARGO_PKG_NAME"),);

    local::setup_local_assets();

    server::run_server().await;

    Ok(())
}
