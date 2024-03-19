use clap::ArgMatches;
use std::process::Command;

use crate::{
    deps::{self, JS_ENGINE},
    envs::get_envs,
    paths::PATHS,
};

pub const CMD_NAME: &str = "docker_run_default_local";

pub fn run(matches: &ArgMatches) {
    let extra_args = match matches.get_many::<String>("extra_args") {
        Some(value_ref) => value_ref.map(|v| v.as_str()).collect::<Vec<_>>(),
        None => vec![],
    };

    run_docker(extra_args);
}

fn run_docker(_extra_args: Vec<&str>) {
    // let status = Command::new(deps::SH)
    //     // .env("BUILDKIT_PROGRESS", "plain")
    //     .args(["ci", "build_prfs_api_server"])
    //     .status()
    //     .expect(&format!("{} command failed to start", JS_ENGINE));

    return;

    // let docker_compose_yml_path = PATHS.internals_docker.join("compose/docker-compose.yml");
    // let envs = get_envs();

    // let status = Command::new(deps::DOCKER)
    //     // .env("BUILDKIT_PROGRESS", "plain")
    //     .args([
    //         "compose",
    //         "-f",
    //         docker_compose_yml_path.to_str().unwrap(),
    //         "up",
    //         "--detach",
    //         "--build",
    //         "--no-deps",
    //         "prfs_api_server",
    //     ])
    //     .envs(envs)
    //     .status()
    //     .expect(&format!("{} command failed to start", JS_ENGINE));

    // assert!(status.success());
}
