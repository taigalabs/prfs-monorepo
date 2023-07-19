use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

pub struct Paths {
    pub curr_dir: PathBuf,
    pub prfs_wasm: PathBuf,
    pub wasm_build: PathBuf,
    pub prfs_circuits: PathBuf,
    pub circuits_build: PathBuf,
    pub prf_asset_server: PathBuf,
    pub prf_asset_server_assets_local: PathBuf,
    pub prfs_js: PathBuf,
    pub prfs_web: PathBuf,
    pub e2e_test_web: PathBuf,
    pub prfs_backend: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        println!("Initializing paths...");

        let curr_dir = std::env::current_dir().unwrap();
        println!("curr_dir: {:?}", curr_dir);

        let prfs_wasm = curr_dir.join("source/prfs_wasm");
        println!("prfs_wasm: {:?}", prfs_wasm);

        let wasm_build = curr_dir.join("source/prfs_wasm/build");
        println!("wasm_build_path: {:?}", wasm_build);

        let prfs_circuits = curr_dir.join("source/prfs_circuits");
        println!("circuits_path: {:?}", prfs_circuits);

        let circuits_build = curr_dir.join("source/prfs_circuits/build");
        println!("circuits_build: {:?}", circuits_build);

        let prf_asset_server = curr_dir.join("source/prfs_prf_asset_server");
        println!("prf_asset_server: {:?}", prf_asset_server);

        let prf_asset_server_assets = curr_dir.join("source/prfs_prf_asset_server/assets");
        println!("prf_asset_server_assets: {:?}", prf_asset_server_assets);

        let prf_asset_server_assets_local =
            curr_dir.join("source/prfs_prf_asset_server/assets/local");
        println!(
            "prf_asset_server_assets_local: {:?}",
            prf_asset_server_assets_local,
        );

        let circuits_build = curr_dir.join("source/prfs_circuits/build");
        println!("circuits_build: {:?}", circuits_build);

        let prfs_js = curr_dir.join("source/prfs_js");
        println!("prfs_js: {:?}", prfs_js);

        let prfs_web = curr_dir.join("source/prfs_web");
        println!("prfs_web: {:?}", prfs_web);

        let e2e_test_web = curr_dir.join("source/e2e_test_web");
        println!("e2e_test_web: {:?}", e2e_test_web);

        let prfs_backend = curr_dir.join("source/prfs_backend");
        println!("prfs_backend: {:?}", prfs_backend);

        Paths {
            curr_dir,
            prfs_wasm,
            wasm_build,
            prfs_circuits,
            circuits_build,
            prf_asset_server,
            prf_asset_server_assets_local,
            prfs_js,
            prfs_web,
            e2e_test_web,
            prfs_backend,
        }
    }
}
