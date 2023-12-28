use crate::{
    deps::{self, JS_ENGINE},
    paths::PATHS,
};
use clap::ArgMatches;
use const_format::str_replace;
use std::process::Command;

pub const CMD_NAME: &str = str_replace!(file!(), ".rs", "");

pub fn run(matches: &ArgMatches) {
    println!("11, this_file: {}", CMD_NAME);

    let extra_args = match matches.get_many::<String>("extra_args") {
        Some(value_ref) => value_ref.map(|v| v.as_str()).collect::<Vec<_>>(),
        None => vec![],
    };

    deps::check_nodejs();
    run_app(extra_args);
}

fn run_app(extra_args: Vec<&str>) {
    let extra_args = [vec!["create-envs"], extra_args].concat();

    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.webapp_proof)
        .args(extra_args)
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));
    assert!(status.success());

    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.webapp_proof)
        .args(["run", "dev"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}
