use crate::paths::PATHS;
use crate::utils::copy_dir_all;
use crate::AssetServerError;
use colored::Colorize;
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

    if PATHS.assets.exists() {
        println!(
            "assets path already exists, removing, path: {:?}",
            PATHS.assets,
        );

        std::fs::remove_dir_all(&PATHS.assets).unwrap();
        copy_circuit_build(&circuits_build_path);
    } else {
        copy_circuit_build(&circuits_build_path);
    }

    return load_local_build_json();
}

fn load_local_build_json() -> BuildJson {
    let copied_build_json_path = PATHS.assets.join("build.json");
    let b = std::fs::read(copied_build_json_path).unwrap();
    let circuit_build_json: BuildJson = serde_json::from_slice(&b).unwrap();
    circuit_build_json
}

fn copy_circuit_build(circuit_src: &PathBuf) {
    println!(
        "{} circuit build, src: {:?}, dest: {:?}",
        "Copying".green(),
        circuit_src,
        &PATHS.assets
    );

    copy_dir_all(circuit_src, &PATHS.assets).unwrap();
}
