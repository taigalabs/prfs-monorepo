use clap::ArgMatches;
use std::process::Command;

use crate::{
    create_envs::create_envs,
    deps::{self, CARGO},
    paths::PATHS,
};

pub const CMD_NAME: &str = "cargo_test";

pub fn run(matches: &ArgMatches) {
    let extra_args = match matches.get_many::<String>("extra_args") {
        Some(value_ref) => value_ref.map(|v| v.as_str()).collect::<Vec<_>>(),
        None => vec![],
    };

    deps::check_nodejs();
    run_app(extra_args);
}

fn run_app(extra_args: Vec<&str>) {
    println!("extra_args: {:?}", extra_args);

    let envs = create_envs();
    let args = [vec!["test"], extra_args].concat();

    let status = Command::new(deps::CARGO)
        .args(args)
        .envs(envs)
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
