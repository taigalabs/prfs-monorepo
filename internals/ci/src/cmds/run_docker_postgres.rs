use crate::{
    deps::{self, BASH, DOCKER, JS_ENGINE},
    paths::PATHS,
};
use clap::ArgMatches;
use std::process::Command;

pub fn run(matches: &ArgMatches) {
    let extra_args = match matches.get_many::<String>("extra_args") {
        Some(value_ref) => value_ref.map(|v| v.as_str()).collect::<Vec<_>>(),
        None => vec![],
    };

    run_docker(extra_args);
}

fn run_docker(_extra_args: Vec<&str>) {
    let script = PATHS.internals_ci_docker_postgres.join("run.sh");

    let status = Command::new(BASH)
        .args([script.to_str().unwrap()])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));
    assert!(status.success());
}
