use colored::Colorize;
use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[allow(non_snake_case)]
#[derive(Debug)]
pub struct Paths {
    pub ws_root: PathBuf,

    // ci
    pub internals_ci: PathBuf,
    pub internals__tmux: PathBuf,
    pub internals__vercel: PathBuf,

    // docker
    pub internals_docker: PathBuf,
    pub internals_docker_postgres: PathBuf,

    pub prfs_circuits_circom: PathBuf,
    pub prfs_snap: PathBuf,
    pub prfs_api_server: PathBuf,
    pub prfs_auth_op_server: PathBuf,
    pub prfs_circuit_interface: PathBuf,
    pub prfs_driver_interface: PathBuf,
    pub prfs_docs_website: PathBuf,
    pub prfs_env__bindings: PathBuf,
    pub prfs_entities__bindings: PathBuf,
    pub prfs_console_webapp: PathBuf,
    pub prfs_proof_webapp: PathBuf,
    pub prfs_poll_webapp: PathBuf,
    pub prfs_id_webapp: PathBuf,
    pub prfs_crypto_js: PathBuf,
    pub prfs_crypto_js__build: PathBuf,
    pub prfs_asset_server: PathBuf,
    pub prfs_asset_server_assets: PathBuf,
    pub prfs_asset_server_assets_local: PathBuf,
    // drivers
    pub prfs_driver_spartan_js: PathBuf,
    pub prfs_driver_spartan_wasm: PathBuf,
    pub prfs_driver_spartan_wasm_build: PathBuf,

    // Shy
    pub shy_webapp: PathBuf,
    pub shy_api_server: PathBuf,
    pub shy_entities__bindings: PathBuf,
}

#[allow(non_snake_case)]
impl Paths {
    pub fn new() -> Paths {
        let ws_root = std::env::current_dir().unwrap();

        {
            let ci_file_path = ws_root.join("ci");
            if !ci_file_path.exists() {
                panic!(
                    "Wrong current dir, ci does not exist, path: {:?}",
                    ci_file_path,
                );
            }
        }

        let internals_ci = ws_root.join("internals/ci");
        let internals__tmux = ws_root.join("internals/tmux");
        let internals__vercel = ws_root.join("internals/vercel");
        let internals_docker = ws_root.join("internals/docker");
        let internals_docker_postgres = ws_root.join("internals/docker_postgres");

        let prfs_docs_website = ws_root.join("source/prfs_docs_website");
        let prfs_circuits_circom = ws_root.join("source/prfs_circuits_circom");
        let prfs_circuit_interface = ws_root.join("source/prfs_circuit_interface");
        let prfs_driver_interface = ws_root.join("source/prfs_driver_interface");
        let prfs_snap = ws_root.join("source/prfs_snap");

        let prfs_asset_server = ws_root.join("source/prfs_asset_server");
        let prfs_asset_server_assets = ws_root.join("source/prfs_asset_server/assets");
        let prfs_asset_server_assets_local = ws_root.join("source/prfs_asset_server/assets/local");

        let prfs_env__bindings = ws_root.join("source/prfs_env/bindings");

        let prfs_api_server = ws_root.join("source/prfs_api_server");
        let prfs_auth_op_server = ws_root.join("source/prfs_auth_op_server");
        let prfs_crypto_js = ws_root.join("source/prfs_crypto_js");
        let prfs_crypto_js__build = ws_root.join("source/prfs_crypto_js/build");
        let prfs_id_webapp = ws_root.join("source/prfs_id_webapp");
        let prfs_entities__bindings = ws_root.join("source/prfs_entities/bindings");

        let prfs_driver_spartan_js = ws_root.join("source/prfs_driver_spartan_js");
        let prfs_driver_spartan_wasm = ws_root.join("source/prfs_driver_spartan_wasm");
        let prfs_driver_spartan_wasm_build = ws_root.join("source/prfs_driver_spartan_wasm/build");

        let prfs_console_webapp = ws_root.join("source/prfs_console_webapp");
        let prfs_proof_webapp = ws_root.join("source/prfs_proof_webapp");
        let prfs_poll_webapp = ws_root.join("source/prfs_poll_webapp");

        let shy_webapp = ws_root.join("source/shy_webapp");
        let shy_api_server = ws_root.join("source/shy_api_server");
        let shy_entities__bindings = ws_root.join("source/shy_entities/bindings");

        let p = Paths {
            ws_root,

            // internals
            internals_ci,
            internals__tmux,
            internals__vercel,
            internals_docker,
            internals_docker_postgres,

            // Prfs
            prfs_env__bindings,
            prfs_api_server,
            prfs_auth_op_server,
            prfs_docs_website,
            prfs_console_webapp,
            prfs_proof_webapp,
            prfs_poll_webapp,
            prfs_id_webapp,
            prfs_circuits_circom,
            prfs_snap,
            prfs_circuit_interface,
            prfs_driver_interface,
            prfs_entities__bindings,
            prfs_asset_server,
            prfs_asset_server_assets,
            prfs_asset_server_assets_local,
            prfs_crypto_js,
            prfs_crypto_js__build,
            prfs_driver_spartan_js,
            prfs_driver_spartan_wasm,
            prfs_driver_spartan_wasm_build,

            // Shy
            shy_webapp,
            shy_api_server,
            shy_entities__bindings,
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
