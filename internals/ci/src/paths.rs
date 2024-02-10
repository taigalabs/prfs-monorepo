use colored::Colorize;
use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[allow(non_snake_case)]
#[derive(Debug)]
pub struct Paths {
    pub curr_dir: PathBuf,

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
    pub prfs_entities__bindings: PathBuf,
    pub prfs_console_webapp: PathBuf,
    pub prfs_proof_webapp: PathBuf,
    pub prfs_poll_webapp: PathBuf,
    pub prfs_id_webapp: PathBuf,
    pub prfs_embed_webapp: PathBuf,
    // asset server
    pub prfs_asset_server: PathBuf,
    pub prfs_asset_server_assets: PathBuf,
    pub prfs_asset_server_assets_local: PathBuf,
    // crypto
    pub prfs_crypto_js: PathBuf,
    pub prfs_crypto_js__build: PathBuf,
    // drivers
    pub prfs_driver_spartan_js: PathBuf,
    pub prfs_driver_spartan_wasm: PathBuf,
    pub prfs_driver_spartan_wasm_build: PathBuf,

    // Shy
    pub shy_webapp: PathBuf,
    pub shy_api_server: PathBuf,
}

#[allow(non_snake_case)]
impl Paths {
    pub fn new() -> Paths {
        let curr_dir = std::env::current_dir().unwrap();

        {
            let ci_file_path = curr_dir.join("ci");
            if !ci_file_path.exists() {
                panic!(
                    "Wrong current dir, ci does not exist, path: {:?}",
                    ci_file_path,
                );
            }
        }

        let internals_ci = curr_dir.join("internals/ci");
        let internals__tmux = curr_dir.join("internals/tmux");
        let internals__vercel = curr_dir.join("internals/vercel");
        let internals_docker = curr_dir.join("internals/docker");
        let internals_docker_postgres = curr_dir.join("internals/docker_postgres");

        let prfs_docs_website = curr_dir.join("source/prfs_docs_website");
        let prfs_circuits_circom = curr_dir.join("source/prfs_circuits_circom");
        let prfs_circuit_interface = curr_dir.join("source/prfs_circuit_interface");
        let prfs_driver_interface = curr_dir.join("source/prfs_driver_interface");
        let prfs_snap = curr_dir.join("source/prfs_snap");

        let prfs_asset_server = curr_dir.join("source/prfs_asset_server");
        let prfs_asset_server_assets = curr_dir.join("source/prfs_asset_server/assets");
        let prfs_asset_server_assets_local = curr_dir.join("source/prfs_asset_server/assets/local");

        let e2e_test_web = curr_dir.join("source/e2e_test_web");
        let prfs_api_server = curr_dir.join("source/prfs_api_server");
        let prfs_auth_op_server = curr_dir.join("source/prfs_auth_op_server");
        let prfs_crypto_js = curr_dir.join("source/prfs_crypto_js");
        let prfs_crypto_js__build = curr_dir.join("source/prfs_crypto_js/build");
        let prfs_id_webapp = curr_dir.join("source/prfs_id_webapp");
        let prfs_embed_webapp = curr_dir.join("source/prfs_embed_webapp");
        let prfs_entities__bindings = curr_dir.join("source/prfs_entities/bindings");

        let prfs_driver_spartan_js = curr_dir.join("source/prfs_driver_spartan_js");
        let prfs_driver_spartan_wasm = curr_dir.join("source/prfs_driver_spartan_wasm");
        let prfs_driver_spartan_wasm_build = curr_dir.join("source/prfs_driver_spartan_wasm/build");

        let prfs_console_webapp = curr_dir.join("source/prfs_console_webapp");
        let prfs_proof_webapp = curr_dir.join("source/prfs_proof_webapp");
        let prfs_poll_webapp = curr_dir.join("source/prfs_poll_webapp");

        let shy_webapp = curr_dir.join("source/shy_webapp");
        let shy_api_server = curr_dir.join("source/shy_api_server");

        let p = Paths {
            curr_dir,

            // internals
            internals_ci,
            internals__tmux,
            internals__vercel,
            internals_docker,
            internals_docker_postgres,

            // prfs
            prfs_api_server,
            prfs_auth_op_server,
            prfs_docs_website,
            prfs_console_webapp,
            prfs_proof_webapp,
            prfs_poll_webapp,
            prfs_id_webapp,
            prfs_embed_webapp,
            prfs_circuits_circom,
            prfs_snap,
            prfs_circuit_interface,
            prfs_driver_interface,
            prfs_entities__bindings,
            // asset server
            prfs_asset_server,
            prfs_asset_server_assets,
            prfs_asset_server_assets_local,
            // crypto
            prfs_crypto_js,
            prfs_crypto_js__build,
            // drivers
            prfs_driver_spartan_js,
            prfs_driver_spartan_wasm,
            prfs_driver_spartan_wasm_build,

            // shy
            shy_webapp,
            shy_api_server,
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
