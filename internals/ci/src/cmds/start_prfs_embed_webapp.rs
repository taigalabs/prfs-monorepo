use crate::{
    deps::{self, JS_ENGINE},
    paths::PATHS,
};
use clap::ArgMatches;
use std::process::Command;

pub const CMD_NAME: &str = "start_prfs_embed_webapp";

pub fn run(matches: &ArgMatches) {
    let extra_args = match matches.get_many::<String>("extra_args") {
        Some(value_ref) => value_ref.map(|v| v.as_str()).collect::<Vec<_>>(),
        None => vec![],
    };

    deps::check_nodejs();
    run_app(extra_args);
}

fn run_app(extra_args: Vec<&str>) {
    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_embed_webapp)
        .args(["run", "build"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));
    assert!(status.success());

    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_embed_webapp)
        .args(["run", "start"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}
