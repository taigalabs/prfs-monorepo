use crate::{
    deps::{self, DOCKER, JS_ENGINE},
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
    // let tag = "prfs_sdk_web_module";

    // let df_path = PATHS
    //     .internals_docker
    //     .join("prfs_sdk_web_module/Dockerfile");
    // println!("tag: {}, df_path: {:?}", tag, df_path);

    // let status = Command::new(deps::DOCKER)
    //     .args(["build", "-t", tag, "-f", df_path.to_str().unwrap(), "."])
    //     .status()
    //     .expect(&format!("{} command failed to start", JS_ENGINE));

    // assert!(status.success());

    // let status = Command::new(deps::DOCKER)
    //     .args(["run", "-d", "--rm", "-p", "3010:3010", "-t", tag])
    //     .status()
    //     .expect(&format!("{} command failed to start", JS_ENGINE));

    // assert!(status.success());
    let docker_compose_yml_path = PATHS.internals_docker.join("compose/docker-compose.yml");

    let status = Command::new(deps::DOCKER)
        .args([
            "compose",
            "-f",
            docker_compose_yml_path.to_str().unwrap(),
            "up",
            "--detach",
            "--build",
            "--no-deps",
            "prfs_sdk_web_module",
        ])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}
