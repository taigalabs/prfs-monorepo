use hyper::Server;
use hyper_staticfile::Static;
use prfs_asset_server::state::ServerState;
use prfs_asset_server::{paths::PATHS, router::make_router};
use prfs_circuits_circom::builder::CircuitBuildJson;
use routerify::RouterService;
use std::net::SocketAddr;

pub type AssetServerError = Box<dyn std::error::Error + Sync + Send>;

#[tokio::main]
async fn main() -> Result<(), AssetServerError> {
    load_assets();

    let static_serve = Static::new(&PATHS.assets);
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

fn load_assets() {
    let circuits_build_path = prfs_circuits_circom::get_build_fs_path();
    circuits_build_path.try_exists().expect(&format!(
        "circuits should have been built, path: {:?}",
        circuits_build_path
    ));
    println!("prfs_circuits build path: {:?}", circuits_build_path);

    let b = std::fs::read(circuits_build_path.join("build.json")).unwrap();
    let new_circuit_build_json: CircuitBuildJson = serde_json::from_slice(&b).unwrap();
    println!("c: {:?}", new_circuit_build_json);

    if PATHS.assets.exists() {
        let build_json_path = PATHS.assets_local.join("build.json");
        build_json_path.try_exists().unwrap();

        let b = std::fs::read(&build_json_path).unwrap();
        let circuit_build_json: CircuitBuildJson = serde_json::from_slice(&b).unwrap();
        println!("d: {:?}", new_circuit_build_json);
    } else {
        println!("circuits don't exist. Copying...");
    }
}
