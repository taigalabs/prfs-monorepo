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
    let df_path = PATHS.internals_docker.join("webapp_proof/Dockerfile");
    println!("df_path: {:?}", df_path);

    let status = Command::new(deps::DOCKER)
        .args([
            "build",
            "-t",
            "my-rust-app",
            "-f",
            df_path.to_str().unwrap(),
            ".",
        ])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}
