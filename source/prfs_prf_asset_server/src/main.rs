mod build_json;
mod router;

use crate::{build_json::AssetBuildJson, router::make_router};
use hyper::Server;
use routerify::RouterService;
use std::net::SocketAddr;

pub type AssetServerError = Box<dyn std::error::Error + Sync + Send>;

#[tokio::main]
async fn main() {
    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let assets_path = curr_dir.join("source/prfs_prf_asset_server/assets");
    println!("assets_path: {:?}", assets_path);

    assert!(assets_path
        .try_exists()
        .expect("assets path should exist in the file system"));

    let build_json = AssetBuildJson::new().unwrap();

    let addr: SocketAddr = ([127, 0, 0, 1], 4010).into();

    let router = make_router(build_json, &assets_path);

    let service = RouterService::new(router).unwrap();
    let server = Server::bind(&addr).serve(service);

    println!("Server is running on: {}", addr);

    if let Err(err) = server.await {
        eprintln!("Server error: {}", err);
    }
}
