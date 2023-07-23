use crate::{
    deps::{self, JS_ENGINE, NODE_VERSION},
    paths::PATHS,
};
use clap::ArgMatches;
use colored::Colorize;
use std::process::Command;

pub fn run(matches: &ArgMatches) {
    let env = if let Some(e) = matches.get_one::<String>("env") {
        match e.as_str() {
            "production" => Env::PRODUCTION,
            "development" => Env::DEVELOPMENT,
            _ => panic!("Invalid 'env' argumnent"),
        }
    } else {
        Env::DEVELOPMENT
    };
    println!("env: {:?}", env);

    deps::check_nodejs();
    run_app(&env);
}

fn run_app(env: &Env) {
    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(["prepare-env"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));
    assert!(status.success());

    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(["run", "dev"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}

#[derive(Debug)]
enum Env {
    DEVELOPMENT,
    PRODUCTION,
}

impl std::fmt::Display for Env {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            Env::DEVELOPMENT => write!(f, "development"),
            Env::PRODUCTION => write!(f, "production"),
        }
    }
}
