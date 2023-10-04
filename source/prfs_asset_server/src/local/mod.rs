use crate::paths::PATHS;
use crate::utils::copy_dir_all;
use colored::Colorize;

pub fn setup_local_assets() {
    if PATHS.assets.exists() {
        println!(
            "assets path already exists, removing, path: {:?}",
            PATHS.assets,
        );

        std::fs::remove_dir_all(&PATHS.assets).unwrap();
    }

    copy_circuits();
}

fn copy_circuits() {
    let circuits_build_path = prfs_circuit_circom::get_build_fs_path();

    assert!(
        circuits_build_path.exists(),
        "circuits build path should exist, path: {:?}",
        circuits_build_path
    );

    println!("prfs_circuits build path: {:?}", circuits_build_path);

    println!(
        "{} circuit build, src: {:?}, dest: {:?}",
        "Copying".green(),
        circuits_build_path,
        &PATHS.assets_circuits
    );

    copy_dir_all(circuits_build_path, &PATHS.assets_circuits).unwrap();
}
