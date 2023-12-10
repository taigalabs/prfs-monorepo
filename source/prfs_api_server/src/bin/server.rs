use colored::Colorize;
use prfs_api_server::envs::ENVS;
use prfs_api_server::paths::PATHS;
use prfs_api_server::server::router;
use prfs_api_server::server::server::make_server;
use prfs_api_server::server::state::ServerState;
use prfs_api_server::ApiServerError;
use prfs_db_interface::database2::Database2;
use std::net::SocketAddr;
use std::sync::Arc;

const PORT: u16 = 4000;

#[tokio::main]
async fn main() -> Result<(), ApiServerError> {
    println!(
        "{} pkg: {}, curr_dir: {:?}",
        "Starting".green(),
        env!("CARGO_PKG_NAME"),
        std::env::current_dir(),
    );

    ENVS.check();

    let server_state = Arc::new(ServerState::init().await.unwrap());
    let server = make_server(server_state);

    tokio::select! {
        _ = tokio::signal::ctrl_c() => {},
        _ = server => {},
    }

    Ok(())
}
