use clap::ArgMatches;
use std::{path::PathBuf, process::Command};

use crate::{
    deps::{self},
    envs::get_envs,
    paths::PATHS,
};

pub const CMD_NAME: &str = "start_prfs_api_server_local";

pub fn run(matches: &ArgMatches) {
    let extra_args = match matches.get_many::<String>("extra_args") {
        Some(value_ref) => value_ref.map(|v| v.as_str()).collect::<Vec<_>>(),
        None => vec![],
    };

    deps::check_nodejs();
    run_app(extra_args);
}

fn run_app(_extra_args: Vec<&str>) {
    let prfs_api_server_bin = &PATHS.ws_root.join("prfs_api_server");

    if !prfs_api_server_bin.exists() {
        panic!("prfs_api_server bin does not exist");
    }

    let envs = get_envs();
    let status = Command::new(prfs_api_server_bin)
        .current_dir(&PATHS.ws_root)
        .envs(envs)
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
