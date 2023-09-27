use crate::paths::PATHS;
use crate::utils::copy_dir_all;
use colored::Colorize;
use prfs_circuit_circom::get_build_fs_path;

pub fn setup_local_assets() {
    if PATHS.assets.exists() {
        println!(
            "assets path already exists, removing, path: {:?}",
            PATHS.assets,
        );

        std::fs::remove_dir_all(&PATHS.assets).unwrap();
    }

    copy_circuits();
    copy_drivers();
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

fn copy_drivers() {
    let drivers_dist_path = PATHS.ws_prfs_driver_spartan_js.join("dist");

    assert!(
        drivers_dist_path.exists(),
        "drivers dist path should exist, path: {:?}",
        drivers_dist_path
    );

    println!(
        "{} src: {:?}, dest: {:?}",
        "Copying".green(),
        drivers_dist_path,
        &PATHS.assets_drivers
    );

    copy_dir_all(drivers_dist_path, &PATHS.assets_drivers).unwrap();
}
