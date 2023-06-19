mod build_project;

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
        _ => {
            panic!(
                "[ci] Could not find the operation. Did you mean 'build'?, op: {}",
                op
            );
        }
    }
}
