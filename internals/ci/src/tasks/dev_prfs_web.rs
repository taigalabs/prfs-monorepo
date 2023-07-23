use crate::{
    deps::{self, JS_ENGINE},
    paths::PATHS,
};
use clap::ArgMatches;
use std::process::Command;

pub fn run(matches: &ArgMatches) {
    let teaser = matches.get_one::<bool>("teaser").unwrap();

    deps::check_nodejs();
    run_app(teaser);
}

fn run_app(teaser: &bool) {
    let mut prepare_args = vec!["prepare-env"];

    if *teaser {
        prepare_args.push("--teaser");
    }

    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(prepare_args)
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
