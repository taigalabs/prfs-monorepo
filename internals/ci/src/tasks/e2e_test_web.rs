use crate::{paths::Paths, tasks::JS_ENGINE};
use clap::ArgMatches;
use std::process::Command;

pub fn run(_matches: &ArgMatches, paths: &Paths) {
    let status = Command::new(JS_ENGINE)
        .current_dir(&paths.e2e_test_web)
        .args(["run", "bench"])
        .status()
        .expect("yarn command failed to start");

    assert!(status.success());
}
