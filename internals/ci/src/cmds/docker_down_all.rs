use crate::{
    deps::{self, JS_ENGINE},
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

fn run_docker(extra_args: Vec<&str>) {
    println!("extra_args: {:?}", extra_args);

    let docker_compose_yml_path = PATHS.internals_docker.join("compose/docker-compose.yml");

    let args = extra_args.join(" ");

    let status = Command::new(deps::DOCKER)
        .args([
            "compose",
            "-f",
            docker_compose_yml_path.to_str().unwrap(),
            "down",
        ])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}
