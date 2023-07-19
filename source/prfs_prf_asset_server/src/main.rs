mod apis;
mod paths;
mod router;
mod state;

use crate::{paths::Paths, router::make_router};
use hyper::Server;
use hyper_staticfile::Static;
use routerify::RouterService;
use state::ServerState;
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

    let static_serve = Static::new(assets_path);
    let server_state = ServerState { static_serve };

    let router = make_router(server_state);

    let service = RouterService::new(router).unwrap();
    let addr: SocketAddr = ([127, 0, 0, 1], 4010).into();
    let server = Server::bind(&addr).serve(service);

    println!("Server is running on: {}", addr);

    if let Err(err) = server.await {
        eprintln!("Server error: {}", err);
    }

    Ok(())
}
