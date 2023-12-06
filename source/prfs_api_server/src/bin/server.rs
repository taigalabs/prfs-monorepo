use colored::Colorize;
use prfs_api_server::envs::ENVS;
use prfs_api_server::paths::PATHS;
use prfs_api_server::server::router;
use prfs_api_server::server::server::make_server;
use prfs_api_server::server::state::ServerState;
use prfs_api_server::ApiServerError;
use prfs_db_interface::database2::Database2;
// use routerify::RouterService;
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

    // let router = router::make_router(server_state).expect("make_router fail");
    // let service = RouterService::new(router).expect("router service init fail");

    // let addr = SocketAddr::from(([0, 0, 0, 0], PORT));
    // let server = Server::bind(&addr).serve(service);

    // println!("Prfs backend is running on: {}", addr);
    // if let Err(err) = server.await {
    //     eprintln!("Server error: {}", err);
    // }
    //
    tokio::select! {
        _ = tokio::signal::ctrl_c() => {},
        _ = server => {},
    }

    Ok(())
}
