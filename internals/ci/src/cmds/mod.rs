// build
pub mod build;
pub mod build_circuits;
pub mod build_prfs_crypto_js;
pub mod build_prfs_driver_spartan_js;

// dev mode
pub mod dev_prfs_api_server;
pub mod dev_prfs_asset_server;
pub mod dev_prfs_console_webapp;
pub mod dev_prfs_docs_website;
pub mod dev_prfs_id_webapp;
pub mod dev_prfs_poll_webapp;
pub mod dev_prfs_proof_webapp;
pub mod dev_shy_webapp;
pub mod dev_snap;

// prod mode
pub mod start_prfs_api_server;
pub mod start_prfs_asset_server;
pub mod start_prfs_console_webapp;
pub mod start_prfs_docs_website;
pub mod start_prfs_id_webapp;
pub mod start_prfs_poll_webapp;
pub mod start_prfs_proof_webapp;
pub mod start_shy_webapp;

// docker
pub mod docker_down_all;
pub mod docker_run_api_server;
pub mod docker_run_default;
pub mod docker_run_default_local;
pub mod docker_run_postgres;
pub mod docker_run_prfs_proof_webapp;

// seed
pub mod seed_assets;
pub mod seed_prfs_api_data;
pub mod seed_shy_api_data;

// tmux
pub mod tmux;

// Vercel
pub mod vercel_deploy;
