use colored::Colorize;
use prfs_asset_server::server;
use prfs_asset_server::{local, AssetServerError};

#[tokio::main]
async fn main() -> Result<(), AssetServerError> {
    println!("{} {}", "Starting".green(), env!("CARGO_PKG_NAME"),);

    server::run_server().await;

    Ok(())
}
