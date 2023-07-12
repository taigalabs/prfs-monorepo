use dotenv::dotenv;
use hyper::Server;
use prfs_backend::{router, BackendError};
use prfs_db_interface::database::Database;
use routerify::RouterService;
use std::net::SocketAddr;

#[tokio::main]
async fn main() -> Result<(), BackendError> {
    dotenv()?;

    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT")?;
    let pg_pw = std::env::var("POSTGRES_PW")?;
    let db = Database::connect(pg_endpoint, pg_pw).await?;

    let router = router::make_router(db)?;
    let service = RouterService::new(router).unwrap();

    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));
    let server = Server::bind(&addr).serve(service);

    println!("Prfs backend is running on: {}", addr);
    if let Err(err) = server.await {
        eprintln!("Server error: {}", err);
    }

    Ok(())
}

// #[tokio::main]
// async fn main() -> Result<(), AssetServerError> {
//     let curr_dir = std::env::current_dir().unwrap();
//     println!("curr_dir: {:?}", curr_dir);

//     let assets_path = curr_dir.join("source/prfs_prf_asset_server/assets");
//     println!("assets_path: {:?}", assets_path);

//     assert!(assets_path
//         .try_exists()
//         .expect("assets path should exist in the file system"));

//     let router = make_router(&assets_path);

//     let service = RouterService::new(router).unwrap();
//     let addr: SocketAddr = ([127, 0, 0, 1], 4010).into();
//     let server = Server::bind(&addr).serve(service);

//     println!("Server is running on: {}", addr);

//     if let Err(err) = server.await {
//         eprintln!("Server error: {}", err);
//     }

//     Ok(())
// }
