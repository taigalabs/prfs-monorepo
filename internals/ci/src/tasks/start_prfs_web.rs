use crate::{
    deps::{self, JS_ENGINE, NODE_VERSION},
    paths::PATHS,
};
use clap::ArgMatches;
use colored::Colorize;
use std::process::Command;

pub fn run(matches: &ArgMatches) {
    deps::check_nodejs();
    run_app();
}

fn run_app() {
    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(["prepare-env", "--production"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));
    assert!(status.success());

    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(["run", "build"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(["run", "start"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}
