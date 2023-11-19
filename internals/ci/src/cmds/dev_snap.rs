use crate::{deps, paths::PATHS};
use clap::ArgMatches;
use colored::Colorize;
use std::process::Command;

pub fn run(_matches: &ArgMatches) {
    run_app();
}

fn run_app() {
    let status = Command::new(deps::JS_ENGINE)
        .current_dir(&PATHS.prfs_snap)
        .args(["run", "start"])
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
