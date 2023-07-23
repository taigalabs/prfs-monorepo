use crate::paths::PATHS;
use crate::utils::copy_dir_all;
use crate::AssetServerError;
use prfs_circuits_circom::access::get_build_fs_path;
use prfs_circuits_circom::BuildJson;
use std::path::PathBuf;

pub fn setup_local_assets() -> BuildJson {
    let circuits_build_path = get_build_fs_path();
    assert!(
        circuits_build_path.exists(),
        "circuits build path should exist, path: {:?}",
        circuits_build_path
    );

    println!("prfs_circuits build path: {:?}", circuits_build_path);

    let b = std::fs::read(circuits_build_path.join("build.json")).unwrap();
    let original_circuit_build_json: BuildJson = serde_json::from_slice(&b).unwrap();

    if PATHS.assets.exists() {
        let build_json_path = PATHS.assets.join("build.json");
        println!("build.json path: {:?}", build_json_path);

        if !build_json_path.exists() {
            copy_circuit_build(&circuits_build_path);
            return load_local_build_json();
        }

        let b = std::fs::read(&build_json_path).unwrap();
        let local_circuit_build_json: BuildJson = serde_json::from_slice(&b).unwrap();

        let local_timestamp: usize = local_circuit_build_json.timestamp.parse().unwrap();
        let original_timestamp: usize = original_circuit_build_json.timestamp.parse().unwrap();

        if original_timestamp > local_timestamp {
            copy_circuit_build(&circuits_build_path);
            return load_local_build_json();
        } else {
            return load_local_build_json();
        }
    } else {
        println!("circuits don't exist. Copying...");

        copy_circuit_build(&circuits_build_path);

        let local_circuit_build_json = load_local_build_json();
        return local_circuit_build_json;
    }
}

fn load_local_build_json() -> BuildJson {
    let copied_build_json_path = PATHS.assets.join("build.json");
    let b = std::fs::read(copied_build_json_path).unwrap();
    let circuit_build_json: BuildJson = serde_json::from_slice(&b).unwrap();
    circuit_build_json
}

fn copy_circuit_build(circuit_src: &PathBuf) {
    copy_dir_all(circuit_src, &PATHS.assets).unwrap();
}
