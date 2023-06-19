mod build_project;
mod dev_prfs_web;
mod e2e_node;

use clap::{command, Arg, ArgAction};
use std::{env, fs, path::PathBuf};

fn main() {
    let matches = command!() // requires `cargo` feature
        .arg(Arg::new("operation").action(ArgAction::Append))
        .get_matches();

    let op = matches.get_one::<String>("operation").unwrap().clone();

    match op.as_str() {
        "build" => {
            build_project::run();
        }
        "e2e_node" => {
            e2e_node::run();
        }
        "dev_prfs_web" => {
            dev_prfs_web::run();
        }
        _ => {
            panic!(
                "[ci] Could not find the operation. Did you mean 'build'?, op: {}",
                op
            );
        }
    }
}
