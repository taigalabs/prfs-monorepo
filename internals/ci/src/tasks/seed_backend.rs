use crate::paths::PATHS;
use clap::ArgMatches;
use std::process::Command;

pub fn run(_matches: &ArgMatches) {
    run_app();
}

fn run_app() {
    let bin = "cargo";
    let status = Command::new(bin)
        .current_dir(&PATHS.prfs_backend)
        .args(["run", "-p", "prfs_backend", "--bin", "seed"])
        .status()
        .expect(&format!("{} command failed to start", bin));

    assert!(status.success());
}
