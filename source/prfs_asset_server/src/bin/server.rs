use hyper::Server;
use hyper_staticfile::Static;
use prfs_asset_server::state::ServerState;
use prfs_asset_server::utils::copy_dir_all;
use prfs_asset_server::AssetServerError;
use prfs_asset_server::{paths::PATHS, router::make_router};
use prfs_circuits_circom::access::get_build_fs_path;
use prfs_circuits_circom::builder::CircuitBuildJson;
use routerify::RouterService;
use std::net::SocketAddr;
use std::path::PathBuf;

#[tokio::main]
async fn main() -> Result<(), AssetServerError> {
    let _circuit_build_json = match setup_local_assets() {
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

fn setup_local_assets() -> Result<CircuitBuildJson, AssetServerError> {
    let circuits_build_path = get_build_fs_path();
    circuits_build_path.try_exists()?;

    println!("prfs_circuits build path: {:?}", circuits_build_path);

    let b = std::fs::read(circuits_build_path.join("build.json"))?;
    let new_circuit_build_json: CircuitBuildJson = serde_json::from_slice(&b)?;

    if PATHS.assets.exists() {
        let build_json_path = PATHS.assets_local.join("build.json");
        build_json_path.try_exists()?;

        let b = std::fs::read(&build_json_path)?;
        let old_circuit_build_json: CircuitBuildJson = serde_json::from_slice(&b)?;

        let old_timestamp: usize = old_circuit_build_json.timestamp.parse()?;
        let new_timestamp: usize = new_circuit_build_json.timestamp.parse()?;

        if new_timestamp > old_timestamp {
            copy_circuit_build(circuits_build_path);
        }
    } else {
        println!("circuits don't exist. Copying...");

        copy_circuit_build(circuits_build_path);
    }

    return Ok(new_circuit_build_json);
}

fn copy_circuit_build(circuit_src: PathBuf) {
    copy_dir_all(circuit_src, &PATHS.assets).unwrap();
}
