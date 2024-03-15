use colored::Colorize;
use prfs_api_server::envs::ENVS;
use prfs_api_server::server::server2::run_server;
use prfs_api_server::ApiServerError;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

#[tokio::main]
async fn main() -> Result<(), ApiServerError> {
    println!(
        "{} pkg: {}, curr_dir: {:?}",
        "Starting".green(),
        env!("CARGO_PKG_NAME"),
        std::env::current_dir(),
    );

    ENVS.check();

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                // axum logs rejections from built-in extractors with the `axum::rejection`
                // target, at `TRACE` level. `axum::rejection=trace` enables showing those events
                format!(
                    "{},{},{},{},{}",
                    prfs_api_server::log::RUST_LOG_ENV,
                    shy_api_server::log::RUST_LOG_ENV,
                    prfs_id_session_server::log::RUST_LOG_ENV,
                    "tower_http=info",
                    "axum::rejection=trace"
                )
                .into()
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
