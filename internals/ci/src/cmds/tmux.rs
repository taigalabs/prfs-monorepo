use std::process::Command;

use clap::ArgMatches;
use colored::Colorize;
use serde::{Deserialize, Serialize};

use crate::{build_handle::BuildHandle, deps, paths::PATHS};

pub fn run(sub_matches: &ArgMatches) {
    let extra_args = match sub_matches.get_many::<String>("extra_args") {
        Some(value_ref) => value_ref.map(|v| v.as_str()).collect::<Vec<_>>(),
        None => vec![],
    };

    if extra_args.len() > 0 {
        println!("tmux extra args: {:?}", extra_args);

        if let Some(name) = extra_args.get(0) {
            let fp = PATHS.internals__tmux.join(format!("{}.sh", name));

            if fp.exists() {
                println!(
                    "Found a tmux script, launching, path: {}",
                    fp.to_str().unwrap()
                );

                let status = Command::new(deps::SH)
                    .args([fp.into_os_string()])
                    .status()
                    .expect(&format!("{} command failed to start", deps::CARGO));
                assert!(status.success());
            } else {
                println!("Cannot find tmux script: {}", fp.to_str().unwrap());
            }
        }
    } else {
        println!("You didn't provide the extra args to run the tmux command");
    }
}
