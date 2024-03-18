use clap::ArgMatches;
use std::process::Command;

use crate::{
    deps::{self},
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

fn run_app(extra_args: Vec<&str>) {
    let bin = PATHS.ws_root.join("prfs_api_server");
    let status = Command::new(bin)
        .current_dir(&PATHS.prfs_api_server)
        // .args(["run", "-p", "prfs_api_server", "--release"])
        .env("GIT_COMMIT_HASH", "aaa")
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
