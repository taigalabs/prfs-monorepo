use dotenv::dotenv;
use hyper::Server;
use prfs_backend::{build_router, BackendError};
use prfs_db_interface::Database;
use routerify::RouterService;
use std::net::SocketAddr;
use std::sync::Arc;
use tokio_postgres::NoTls;

#[tokio::main]
async fn main() -> Result<(), BackendError> {
    {
        let dotenv_path = dotenv().expect("dotenv should exist");
        println!(".env path: {:?}", dotenv_path);
    }

    let db = Database::connect().await?;

    let router = build_router(db);

    // Create a Service from the router above to handle incoming requests.
    let service = RouterService::new(router).unwrap();

    // The address on which the server will be listening.
    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));

    // Create a server by passing the created service to `.serve` method.
    let server = Server::bind(&addr).serve(service);

    println!("App is running on: {}", addr);
    if let Err(err) = server.await {
        eprintln!("Server error: {}", err);
    }

    Ok(())
}
