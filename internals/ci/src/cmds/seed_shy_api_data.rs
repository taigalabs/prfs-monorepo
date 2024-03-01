use clap::ArgMatches;
use std::process::Command;

use crate::{deps, paths::PATHS};

pub const CMD_NAME: &str = "seed_shy_api_data";

pub fn run(_matches: &ArgMatches) {
    run_app();
}

fn run_app() {
    let status = Command::new(deps::JS_ENGINE)
        .current_dir(&PATHS.shy_api_server)
        .args(["run", "create-bindings"])
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());

    let status = Command::new(deps::CARGO)
        .current_dir(&PATHS.shy_api_server)
        .args([
            "run",
            "--release",
            "-p",
            "shy_api_server",
            "--bin",
            "shy_api_server_seed",
        ])
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
