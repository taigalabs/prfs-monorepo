use crate::paths::PATHS;
use crate::utils::copy_dir_all;
use crate::AssetServerError;
use colored::Colorize;
use prfs_circuits_circom::access::get_build_fs_path;
use prfs_circuits_circom::CircuitBuildJson;
use std::collections::HashMap;
use std::path::PathBuf;

pub fn setup_local_assets() -> HashMap<String, CircuitBuildJson> {
    copy_assets();

    return load_local_build_json();
}

fn load_local_build_json() -> HashMap<String, CircuitBuildJson> {
    unimplemented!();
    // let copied_build_json_path = PATHS.assets.join("build.json");
    // let b = std::fs::read(copied_build_json_path).unwrap();
    // let circuit_build_json: CircuitBuildJson = serde_json::from_slice(&b).unwrap();
    // circuit_build_json
}

fn copy_assets() {
    let circuits_build_path = get_build_fs_path();

    assert!(
        circuits_build_path.exists(),
        "circuits build path should exist, path: {:?}",
        circuits_build_path
    );

    println!("prfs_circuits build path: {:?}", circuits_build_path);

    if PATHS.assets.exists() {
        println!(
            "assets path already exists, removing, path: {:?}",
            PATHS.assets,
        );

        std::fs::remove_dir_all(&PATHS.assets).unwrap();
    }

    println!(
        "{} circuit build, src: {:?}, dest: {:?}",
        "Copying".green(),
        circuits_build_path,
        &PATHS.assets
    );

    copy_dir_all(circuits_build_path, &PATHS.assets).unwrap();
}
