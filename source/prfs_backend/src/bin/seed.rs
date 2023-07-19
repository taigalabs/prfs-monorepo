use dotenv::dotenv;
use hyper::Server;
use prfs_backend::{router, BackendError};
use prfs_db_interface::database::Database;
use routerify::RouterService;
use std::net::SocketAddr;

#[tokio::main]
async fn main() -> Result<(), BackendError> {
    println!("Starting backend seeding...");

    Ok(())
}
