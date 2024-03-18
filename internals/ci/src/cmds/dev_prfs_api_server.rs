use clap::ArgMatches;
use std::{collections::HashMap, process::Command};

use crate::{deps, envs::get_envs, paths::PATHS};

pub const CMD_NAME: &str = "dev_prfs_api_server";

pub fn run(_matches: &ArgMatches) {
    run_app();
}

fn run_app() {
    let envs = get_envs();

    let status = Command::new(deps::CARGO)
        .current_dir(&PATHS.prfs_api_server)
        .args(["run", "-p", "prfs_api_server"])
        .envs(envs)
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
