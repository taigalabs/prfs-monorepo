use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

pub struct Paths {
    pub curr_dir: PathBuf,
    pub wasm_path: PathBuf,
    pub wasm_build_path: PathBuf,
    pub circuits_path: PathBuf,
    pub circuit_build_path: PathBuf,
    pub prf_asset_serve_path: PathBuf,
    pub circuits_build_path: PathBuf,
    pub prfs_js_path: PathBuf,
    pub prfs_web: PathBuf,
    pub e2e_test_web: PathBuf,
    pub prfs_backend: PathBuf,
    pub prfs_asset_serve_local_path: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        println!("Initializing paths...");

        let curr_dir = std::env::current_dir().unwrap();
        println!("curr_dir: {:?}", curr_dir);

        let wasm_path = curr_dir.join("source/prfs_wasm");
        println!("wasm_path: {:?}", wasm_path);

        let wasm_build_path = wasm_path.join("build");
        println!("wasm_build_path: {:?}", wasm_build_path);

        let circuits_path = curr_dir.join("source/prfs_circuits");
        println!("circuits_path: {:?}", circuits_path);

        let circuit_build_path = circuits_path.join("build");
        println!("circuit_build_path: {:?}", circuit_build_path);

        let asset_server_path = curr_dir.join("source/prfs_prf_asset_server");
        println!("asset_server_path: {:?}", asset_server_path);

        let prf_asset_serve_path = asset_server_path.join("assets");
        println!("prf_asset_serve_path: {:?}", prf_asset_serve_path);

        let prfs_asset_serve_local_path = prf_asset_serve_path.join("local");
        println!(
            "prfs_asset_serve_local_path: {:?}",
            prfs_asset_serve_local_path
        );

        let circuits_build_path = curr_dir.join("source/prfs_circuits/build");
        println!("circuits_build_path: {:?}", circuits_build_path);

        let prfs_js_path = curr_dir.join("source/prfs_js");
        println!("prfs_js_path: {:?}", prfs_js_path);

        let prfs_web = curr_dir.join("source/prfs_web");
        println!("prfs_web: {:?}", prfs_web);

        let e2e_test_web = curr_dir.join("source/e2e_test_web");
        println!("e2e_test_web: {:?}", e2e_test_web);

        let prfs_backend = curr_dir.join("source/prfs_backend");
        println!("prfs_backend: {:?}", prfs_backend);

        Paths {
            curr_dir,
            wasm_path,
            wasm_build_path,
            circuits_path,
            circuit_build_path,
            prf_asset_serve_path,
            circuits_build_path,
            prfs_js_path,
            prfs_web,
            e2e_test_web,
            prfs_backend,
            prfs_asset_serve_local_path,
        }
    }
}
