use crate::{deps, paths::PATHS};
use clap::ArgMatches;
use std::process::Command;

pub fn run(_matches: &ArgMatches) {
    run_app();
}

fn run_app() {
    let status = Command::new(deps::JS_ENGINE)
        .current_dir(&PATHS.prfs_api_server)
        .args(["run", "create-bindings"])
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());

    // let status = Command::new(deps::CARGO)
    //     .current_dir(&PATHS.prfs_api_server)
    //     .args(["run", "--release", "-p", "prfs_api_server", "--bin", "seed"])
    //     .status()
    //     .expect(&format!("{} command failed to start", deps::CARGO));

    // assert!(status.success());
}
