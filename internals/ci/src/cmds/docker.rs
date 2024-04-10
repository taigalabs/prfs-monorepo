use clap::ArgMatches;
use std::process::Command;

use crate::{create_envs::create_envs, deps, paths::PATHS};

pub const CMD_NAME: &str = "docker";

pub fn run(sub_matches: &ArgMatches) {
    let envs = create_envs();

    let extra_args = match sub_matches.get_many::<String>("extra_args") {
        Some(value_ref) => value_ref.map(|v| v.as_str()).collect::<Vec<_>>(),
        None => vec![],
    };

    if extra_args.len() > 0 {
        println!("extra args: {:?}", extra_args);

        if let Some(name) = extra_args.get(0) {
            let file_path = PATHS.internals__docker.join(format!("{}.sh", name));

            if file_path.exists() {
                println!(
                    "Found a tmux script, launching, path: {}",
                    file_path.to_str().unwrap()
                );

                let status = Command::new(deps::SH)
                    .args([file_path.into_os_string()])
                    .envs(envs)
                    .status()
                    .expect(&format!("{} command failed to start", deps::CARGO));

                assert!(status.success());
            } else {
                println!("Cannot find script: {}", file_path.to_str().unwrap());
            }
        }
    } else {
        println!("You didn't provide the extra args to run the command");
    }
}
