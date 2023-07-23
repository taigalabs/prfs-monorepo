use crate::{
    deps::{self, JS_ENGINE},
    paths::PATHS,
};
use clap::ArgMatches;
use std::process::Command;

pub fn run(matches: &ArgMatches) {
    match matches.get_one::<bool>("teaser") {
        Some(t) => println!("1"),
        None => println!("2"),
    }

    deps::check_nodejs();
    run_app();
}

fn run_app() {
    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(["prepare-env"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));
    assert!(status.success());

    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(["run", "dev"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}
