use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

pub struct Paths {
    pub curr_dir: PathBuf,
    pub circuits_build: PathBuf,
    pub wasm_build: PathBuf,
    pub e2e_test_web: PathBuf,
    pub prfs_wasm: PathBuf,
    pub prfs_circuits_circom: PathBuf,
    pub prfs_api_server: PathBuf,
    pub prfs_asset_server: PathBuf,
    pub prfs_asset_server_assets: PathBuf,
    pub prfs_asset_server_assets_local: PathBuf,
    pub prfs_js: PathBuf,
    pub prfs_web: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        println!("Initializing {} paths...", env!("CARGO_PKG_NAME"));

        let curr_dir = std::env::current_dir().unwrap();
        println!("curr_dir: {:?}", curr_dir);

        let prfs_wasm = curr_dir.join("source/prfs_wasm");
        println!("prfs_wasm: {:?}", prfs_wasm);

        let wasm_build = curr_dir.join("source/prfs_wasm/build");
        println!("wasm_build_path: {:?}", wasm_build);

        let prfs_circuits_circom = curr_dir.join("source/prfs_circuits_circom");
        println!("circuits_circom_path: {:?}", prfs_circuits_circom);

        let circuits_build = curr_dir.join("source/prfs_circuits/build");
        println!("circuits_build: {:?}", circuits_build);

        let prfs_asset_server = curr_dir.join("source/prfs_asset_server");
        println!("prfs_asset_server: {:?}", prfs_asset_server);

        let prfs_asset_server_assets = curr_dir.join("source/prfs_asset_server/assets");
        println!("prfs_asset_server_assets: {:?}", prfs_asset_server_assets);

        let prfs_asset_server_assets_local = curr_dir.join("source/prfs_asset_server/assets/local");
        println!(
            "prfs_asset_server_assets_local: {:?}",
            prfs_asset_server_assets_local,
        );

        let circuits_build = curr_dir.join("source/prfs_circuits/build");
        println!("circuits_build: {:?}", circuits_build);

        let prfs_js = curr_dir.join("source/prfs_js");
        println!("prfs_js: {:?}", prfs_js);

        let prfs_web = curr_dir.join("source/prfs_web");
        println!("prfs_web: {:?}", prfs_web);

        let e2e_test_web = curr_dir.join("source/e2e_test_web");
        println!("e2e_test_web: {:?}", e2e_test_web);

        let prfs_api_server = curr_dir.join("source/prfs_api_server");
        println!("prfs_api_server: {:?}", prfs_api_server);

        Paths {
            curr_dir,
            prfs_wasm,
            wasm_build,
            prfs_circuits_circom,
            circuits_build,
            prfs_asset_server,
            prfs_asset_server_assets,
            prfs_asset_server_assets_local,
            prfs_js,
            prfs_web,
            e2e_test_web,
            prfs_api_server,
        }
    }
}
