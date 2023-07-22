use hyper_staticfile::Static;
use prfs_circuits_circom::access::get_build_fs_path;
use prfs_circuits_circom::BuildJson;
use std::path::PathBuf;

use crate::paths::PATHS;
use crate::utils::copy_dir_all;
use crate::AssetServerError;

pub fn setup_local_assets() -> Result<BuildJson, AssetServerError> {
    let circuits_build_path = get_build_fs_path();
    circuits_build_path.try_exists()?;

    println!("prfs_circuits build path: {:?}", circuits_build_path);

    let b = std::fs::read(circuits_build_path.join("build.json"))?;
    let new_circuit_build_json: BuildJson = serde_json::from_slice(&b)?;

    if PATHS.assets.exists() {
        let build_json_path = PATHS.assets_local.join("build.json");
        build_json_path.try_exists()?;

        let b = std::fs::read(&build_json_path)?;
        let old_circuit_build_json: BuildJson = serde_json::from_slice(&b)?;

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
