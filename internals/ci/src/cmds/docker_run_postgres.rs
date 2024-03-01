use clap::ArgMatches;
use std::process::Command;

use crate::deps::{self, JS_ENGINE};

pub fn run(matches: &ArgMatches) {
    let extra_args = match matches.get_many::<String>("extra_args") {
        Some(value_ref) => value_ref.map(|v| v.as_str()).collect::<Vec<_>>(),
        None => vec![],
    };

    run_docker(extra_args);
}

fn run_docker(_extra_args: Vec<&str>) {
    let status = Command::new(deps::DOCKER)
        .args(["pull", "postgres"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());

    let status = Command::new(deps::DOCKER)
        .args([
            "run",
            "--name",
            "prfs_postgres",
            "-p",
            "5433:5432",
            "-e",
            "POSTGRES_USER=postgres",
            "-e",
            "POSTGRES_USER=postgres",
            "-e",
            "POSTGRES_PASSWORD=postgres",
            "-e",
            "POSTGRES_DB=postgres",
            "-d",
            "postgres",
        ])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}

// docker pull postgres
// docker stop prfs_postgres || true && \
// docker rm prfs_postgres || true && \

// docker run\
//     --name prfs_postgres\
//     -p 5433:5432\
//     -e POSTGRES_USER=postgres\
//     -e POSTGRES_PASSWORD=postgres\
//     -e POSTGRES_DB=postgres\
//     -d\
//     postgres
