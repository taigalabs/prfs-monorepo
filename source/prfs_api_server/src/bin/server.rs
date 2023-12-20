use colored::Colorize;
use prfs_api_server::bindgen::generate_error_code_json_binding;
use prfs_api_server::envs::ENVS;
use prfs_api_server::paths::PATHS;
use prfs_api_server::server::router;
use prfs_api_server::server::server::make_server;
use prfs_api_server::server::state::init_server_state;
use prfs_api_server::ApiServerError;
use prfs_common_server_state::ServerState;
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

    // Generate error code json binding file when launching up a server
    generate_error_code_json_binding().unwrap();

    let server_state = {
        let s = init_server_state().await.unwrap();
        Arc::new(s)
    };
    let server = make_server(server_state);

    tokio::select! {
        _ = tokio::signal::ctrl_c() => {},
        _ = server => {},
    }

    Ok(())
}
