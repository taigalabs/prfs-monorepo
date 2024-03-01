use clap::ArgMatches;
use std::process::Command;

use crate::{deps, paths::PATHS};

pub const CMD_NAME: &str = "dev_prfs_api_server";

pub fn run(_matches: &ArgMatches) {
    run_app();
}

fn run_app() {
    let status = Command::new(deps::CARGO)
        .current_dir(&PATHS.prfs_api_server)
        .args(["run", "-p", "prfs_api_server"])
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
