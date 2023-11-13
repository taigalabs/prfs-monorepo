use crate::{deps, paths::PATHS};
use clap::ArgMatches;
use colored::Colorize;
use std::process::Command;

pub fn run(_matches: &ArgMatches) {
    run_app();
}

fn run_app() {
    let status = Command::new(deps::CARGO)
        .current_dir(&PATHS.prfs_email_auth_server)
        .args(["run", "-p", "prfs_email_auth_server"])
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
