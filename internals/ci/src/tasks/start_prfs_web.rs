use crate::{
    deps::{self, JS_ENGINE},
    paths::PATHS,
};
use clap::ArgMatches;
use std::process::Command;

pub fn run(matches: &ArgMatches) {
    let extra_args = matches
        .get_many::<String>("extra_args")
        .unwrap()
        .map(|v| v.as_str())
        .collect::<Vec<_>>();

    deps::check_nodejs();
    run_app(extra_args);
}

fn run_app(extra_args: Vec<&str>) {
    let prepare_args = [vec!["prepare-env"], extra_args].concat();

    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(prepare_args)
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));
    assert!(status.success());

    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(["run", "build"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));
    assert!(status.success());

    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(["run", "start"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}
