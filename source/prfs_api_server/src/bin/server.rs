use colored::Colorize;
use prfs_api_server::bindgen::generate_error_code_json_binding;
use prfs_api_server::envs::ENVS;
use prfs_api_server::paths::PATHS;
use prfs_api_server::server::server2::run_server;
use prfs_api_server::server::state::init_server_state;
use prfs_api_server::ApiServerError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::database2::Database2;
use std::net::SocketAddr;
use std::sync::Arc;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

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

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                // axum logs rejections from built-in extractors with the `axum::rejection`
                // target, at `TRACE` level. `axum::rejection=trace` enables showing those events
                "prfs_api_server=info,tower_http=info,axum::rejection=trace".into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let server = run_server();

    tokio::select! {
        _ = tokio::signal::ctrl_c() => {},
        _ = server => {},
    }

    Ok(())
}
