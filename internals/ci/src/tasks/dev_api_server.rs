use crate::paths::PATHS;
use clap::ArgMatches;
use colored::Colorize;
use std::process::Command;

pub fn run(_matches: &ArgMatches) {
    run_app();
}

fn run_app() {
    let bin = "cargo";
    let status = Command::new(bin)
        .current_dir(&PATHS.prfs_api_server)
        .args(["run", "-p", "prfs_backend"])
        .status()
        .expect(&format!("{} command failed to start", bin));

    assert!(status.success());
}
