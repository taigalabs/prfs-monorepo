use colored::Colorize;
use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[derive(Debug)]
pub struct Paths {
    pub curr_dir: PathBuf,
    pub e2e_test_web: PathBuf,
    pub prfs_circuit_circom: PathBuf,
    pub prfs_api_server: PathBuf,
    pub prfs_asset_server: PathBuf,
    pub prfs_asset_server_assets: PathBuf,
    pub prfs_asset_server_assets_local: PathBuf,
    pub prfs_entities_bindings: PathBuf,
    pub prfs_driver_type: PathBuf,
    pub prfs_driver_type_bindings: PathBuf,
    pub prfs_driver_spartan_js: PathBuf,
    pub prfs_driver_spartan_wasm: PathBuf,
    pub prfs_driver_spartan_wasm_build: PathBuf,
    pub prfs_web: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let curr_dir = std::env::current_dir().unwrap();

        let prfs_circuit_circom = curr_dir.join("source/prfs_circuit_circom");

        let prfs_asset_server = curr_dir.join("source/prfs_asset_server");
        let prfs_asset_server_assets = curr_dir.join("source/prfs_asset_server/assets");
        let prfs_asset_server_assets_local = curr_dir.join("source/prfs_asset_server/assets/local");

        let prfs_web = curr_dir.join("source/prfs_web");
        let e2e_test_web = curr_dir.join("source/e2e_test_web");
        let prfs_api_server = curr_dir.join("source/prfs_api_server");

        let prfs_entities_bindings = curr_dir.join("source/prfs_entities/bindings");

        let prfs_driver_type = curr_dir.join("source/prfs_driver_type");
        let prfs_driver_type_bindings = curr_dir.join("source/prfs_driver_type/bindings");

        let prfs_driver_spartan_js = curr_dir.join("source/prfs_driver_spartan_js");
        let prfs_driver_spartan_wasm = curr_dir.join("source/prfs_driver_spartan_wasm");
        let prfs_driver_spartan_wasm_build = curr_dir.join("source/prfs_driver_spartan_wasm/build");

        let p = Paths {
            curr_dir,

            prfs_driver_type,
            prfs_driver_type_bindings,

            prfs_driver_spartan_js,
            prfs_driver_spartan_wasm,
            prfs_driver_spartan_wasm_build,

            prfs_circuit_circom,

            prfs_entities_bindings,

            prfs_asset_server,
            prfs_asset_server_assets,
            prfs_asset_server_assets_local,

            prfs_web,
            e2e_test_web,
            prfs_api_server,
        };

        println!(
            "{} paths, pkg: {}, Paths: {:#?}",
            "Loaded".green(),
            env!("CARGO_PKG_NAME"),
            p
        );

        p
    }
}
