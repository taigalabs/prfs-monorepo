mod utils;

use colored::Colorize;

use crate::paths::PATHS;

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
    let circuits_build_path = prfs_circuits_circom::get_build_fs_path();

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

    utils::copy_dir_all(circuits_build_path, &PATHS.assets_circuits).unwrap();
}
