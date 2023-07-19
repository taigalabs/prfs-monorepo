use crate::{paths::PATHS, tasks::JS_ENGINE};
use clap::ArgMatches;
use std::process::Command;

pub fn run(_matches: &ArgMatches) {
    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.e2e_test_web)
        .args(["run", "bench"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}
