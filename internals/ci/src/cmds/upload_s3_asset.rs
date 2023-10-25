use crate::{deps, paths::PATHS};
use clap::ArgMatches;
use std::process::Command;

pub fn run(_matches: &ArgMatches) {
    run_app();
}

fn run_app() {
    let status = Command::new(deps::CARGO)
        .current_dir(&PATHS.prfs_asset_server)
        .args([
            "run",
            "-p",
            "prfs_asset_server",
            "--bin",
            "prfs_asset_server_upload_s3",
        ])
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
