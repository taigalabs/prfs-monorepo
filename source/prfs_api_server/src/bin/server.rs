use colored::Colorize;
use git2::Repository;
use hyper::Server;
use prfs_api_server::envs::ENVS;
use prfs_api_server::paths::PATHS;
use prfs_api_server::server::router;
use prfs_api_server::server::state::ServerState;
use prfs_api_server::ApiServerError;
use prfs_db_interface::database2::Database2;
use routerify::RouterService;
use std::net::SocketAddr;
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<(), ApiServerError> {
    println!(
        "{} pkg: {}, curr_dir: {:?}",
        "Starting".green(),
        env!("CARGO_PKG_NAME"),
        std::env::current_dir(),
    );

    ENVS.check();

    {
        let repo = match Repository::open(&PATHS.workspace_dir) {
            Ok(repo) => repo,
            Err(e) => panic!("failed to init: {}", e),
        };

        let mut revwalk = repo.revwalk().unwrap();
        revwalk.push_head()?;
        let a = revwalk.next().unwrap();
        let b = repo.find_commit(a?).unwrap();
        let t = b.time();

        println!("b: {:?}, t: {:?}", b, t);
    }

    let pg_endpoint = &ENVS.postgres_endpoint;
    let pg_username = &ENVS.postgres_username;
    let pg_pw = &ENVS.postgres_pw;

    let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
        .await
        .unwrap();

    let server_state = Arc::new(ServerState::new(db2).unwrap());

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
