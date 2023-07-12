use dotenv::dotenv;
use hyper::Server;
use prfs_backend::{router, BackendError};
use prfs_db_interface::database::Database;
use routerify::RouterService;
use std::net::SocketAddr;

#[tokio::main]
async fn main() -> Result<(), BackendError> {
    dotenv().expect("dotenv failed");

    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT").expect("POSTGRES_ENDPOINT missing");
    let pg_pw = std::env::var("POSTGRES_PW").expect("POSTGRES_PW missing");
    let db = Database::connect(pg_endpoint, pg_pw).await?;

    let router = router::make_router(db).expect("make_router fail");
    let service = RouterService::new(router).expect("router service init fail");

    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));
    let server = Server::bind(&addr).serve(service);

    println!("Prfs backend is running on: {}", addr);
    if let Err(err) = server.await {
        eprintln!("Server error: {}", err);
    }

    Ok(())
}
