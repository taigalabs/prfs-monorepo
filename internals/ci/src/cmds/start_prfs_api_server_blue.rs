use clap::ArgMatches;
use std::process::Command;

use crate::{
    create_envs::create_envs,
    deps::{self},
    paths::PATHS,
};

pub const CMD_NAME: &str = "start_prfs_api_server_blue";

const SERVER_PORT_BLUE: &str = "40000";

pub fn run(matches: &ArgMatches) {
    let extra_args = match matches.get_many::<String>("extra_args") {
        Some(value_ref) => value_ref.map(|v| v.as_str()).collect::<Vec<_>>(),
        None => vec![],
    };

    deps::check_nodejs();
    run_app(extra_args);
}

fn run_app(extra_args: Vec<&str>) {
    let mut envs = create_envs();
    envs.insert("PRFS_API_SERVER_PORT", SERVER_PORT_BLUE.into());

    let status = Command::new(deps::CARGO)
        .current_dir(&PATHS.prfs_api_server)
        .args(["run", "-p", "prfs_api_server", "--release"])
        .envs(envs)
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
