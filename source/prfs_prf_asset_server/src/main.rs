mod asset_status;
mod router;

use crate::router::make_router;
use asset_status::AssetStatus;
use hyper::Server;
use routerify::RouterService;
use std::net::SocketAddr;

pub type AssetServerError = Box<dyn std::error::Error + Sync + Send>;

#[tokio::main]
async fn main() -> Result<(), AssetServerError> {
    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let assets_path = curr_dir.join("source/prfs_prf_asset_server/assets");
    println!("assets_path: {:?}", assets_path);

    assert!(assets_path
        .try_exists()
        .expect("assets path should exist in the file system"));

    let addr: SocketAddr = ([127, 0, 0, 1], 4010).into();

    let asset_status = AssetStatus::new(&assets_path)?;

    let router = make_router(asset_status, &assets_path);

    let service = RouterService::new(router).unwrap();
    let server = Server::bind(&addr).serve(service);

    println!("Server is running on: {}", addr);

    if let Err(err) = server.await {
        eprintln!("Server error: {}", err);
    }

    Ok(())
}
