use hyper::Server;
use hyper_staticfile::Static;
use prfs_asset_server::state::ServerState;
use prfs_asset_server::{local, AssetServerError};
use prfs_asset_server::{paths::PATHS, router::make_router};
use routerify::RouterService;
use std::net::SocketAddr;
use std::path::PathBuf;

#[tokio::main]
async fn main() -> Result<(), AssetServerError> {
    let _circuit_build_json = match local::setup_local_assets() {
        Ok(a) => a,
        Err(err) => {
            return Err(format!("Failed to load assets, err: {}", err).into());
        }
    };

    let static_serve = Static::new(&PATHS.assets_local);
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
