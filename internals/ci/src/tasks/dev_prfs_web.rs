use crate::{
    deps::{JS_ENGINE, NODE_VERSION},
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

    check_nodejs();
    run_app(&env);
}

fn run_app(env: &Env) {
    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args([
            "prepare-env",
            // "--env", &env.to_string()
        ])
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

fn check_nodejs() {
    let cmd = "node";
    let output = Command::new("node")
        .args(["--version"])
        .output()
        .expect(&format!("{} command failed to start", cmd));

    let node_version = String::from_utf8(output.stdout).unwrap();
    if NODE_VERSION != node_version.trim() {
        panic!(
            "node wrong version, expected: {}, has: {}",
            NODE_VERSION,
            node_version.trim(),
        );
    }
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
