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

    // docker
    pub internals_docker: PathBuf,
    pub internals_docker_postgres: PathBuf,

    // docs
    pub docs_website: PathBuf,

    // misc
    pub e2e_test_web: PathBuf,
    pub prfs_circuits_circom: PathBuf,

    pub prfs_snap: PathBuf,
    pub prfs_api_server: PathBuf,
    pub prfs_auth_op_server: PathBuf,
    pub prfs_crypto_js: PathBuf,
    pub prfs_crypto_js__build: PathBuf,

    // asset_server
    pub prfs_asset_server: PathBuf,
    pub prfs_asset_server_assets: PathBuf,
    pub prfs_asset_server_assets_local: PathBuf,

    pub prfs_entities_bindings: PathBuf,

    // driver
    pub prfs_driver_spartan_js: PathBuf,
    pub prfs_driver_spartan_wasm: PathBuf,
    pub prfs_driver_spartan_wasm_build: PathBuf,

    // sdk
    pub prfs_sdk_web: PathBuf,
    pub prfs_sdk_web_module: PathBuf,

    // webapps
    pub webapp_console: PathBuf,
    pub webapp_proof: PathBuf,
    pub webapp_shy: PathBuf,
    pub webapp_poll: PathBuf,
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

        let internals_docker = curr_dir.join("internals/docker");
        let internals_docker_postgres = curr_dir.join("internals/docker_postgres");

        let docs_website = curr_dir.join("source/docs_website");
        let prfs_circuits_circom = curr_dir.join("source/prfs_circuits_circom");
        let prfs_snap = curr_dir.join("source/prfs_snap");

        let prfs_asset_server = curr_dir.join("source/prfs_asset_server");
        let prfs_asset_server_assets = curr_dir.join("source/prfs_asset_server/assets");
        let prfs_asset_server_assets_local = curr_dir.join("source/prfs_asset_server/assets/local");

        let e2e_test_web = curr_dir.join("source/e2e_test_web");
        let prfs_api_server = curr_dir.join("source/prfs_api_server");
        let prfs_auth_op_server = curr_dir.join("source/prfs_auth_op_server");
        let prfs_crypto_js = curr_dir.join("source/prfs_crypto_js");
        let prfs_crypto_js__build = curr_dir.join("source/prfs_crypto_js/build");

        let prfs_entities_bindings = curr_dir.join("source/prfs_entities/bindings");

        let prfs_driver_spartan_js = curr_dir.join("source/prfs_driver_spartan_js");
        let prfs_driver_spartan_wasm = curr_dir.join("source/prfs_driver_spartan_wasm");
        let prfs_driver_spartan_wasm_build = curr_dir.join("source/prfs_driver_spartan_wasm/build");

        let prfs_sdk_web = curr_dir.join("source/prfs_sdk_web");
        let prfs_sdk_web_module = curr_dir.join("source/prfs_sdk_web_module");

        let webapp_console = curr_dir.join("source/webapp_console");
        let webapp_proof = curr_dir.join("source/webapp_proof");
        let webapp_poll = curr_dir.join("source/webapp_poll");
        let webapp_shy = curr_dir.join("source/webapp_shy");

        let p = Paths {
            curr_dir,

            docs_website,

            internals_ci,
            internals__tmux,

            internals_docker,
            internals_docker_postgres,

            prfs_driver_spartan_js,
            prfs_driver_spartan_wasm,
            prfs_driver_spartan_wasm_build,

            prfs_circuits_circom,
            prfs_snap,

            prfs_entities_bindings,

            prfs_api_server,
            prfs_auth_op_server,
            prfs_crypto_js,
            prfs_crypto_js__build,

            prfs_asset_server,
            prfs_asset_server_assets,
            prfs_asset_server_assets_local,

            prfs_sdk_web,
            prfs_sdk_web_module,

            webapp_console,
            webapp_proof,
            webapp_poll,
            webapp_shy,

            e2e_test_web,
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
