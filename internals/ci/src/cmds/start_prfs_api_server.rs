use clap::ArgMatches;
use std::process::Command;

use crate::{
    deps::{self},
    envs::get_envs,
    paths::PATHS,
};

pub const CMD_NAME: &str = "start_prfs_api_server";

pub fn run(matches: &ArgMatches) {
    let extra_args = match matches.get_many::<String>("extra_args") {
        Some(value_ref) => value_ref.map(|v| v.as_str()).collect::<Vec<_>>(),
        None => vec![],
    };

    deps::check_nodejs();
    run_app(extra_args);
}

fn run_app(extra_args: Vec<&str>) {
    let envs = get_envs();
    let status = Command::new(deps::CARGO)
        .current_dir(&PATHS.prfs_api_server)
        .args(["run", "-p", "prfs_api_server", "--release"])
        .envs(envs)
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
