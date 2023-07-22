mod build_handle;
mod paths;
mod task;
mod tasks;

use chrono::prelude::*;
use clap::{arg, command, ArgMatches};
use colored::Colorize;
use std::env;
use task::Task;
use tasks::compile_circuits::CompileCircuitsTask;

use crate::{build_handle::BuildHandle, paths::PATHS};

pub type CiError = Box<dyn std::error::Error + Sync + Send>;

fn main() {
    let matches = command!() // requires `cargo` feature
        .version("v0.1")
        .propagate_version(true)
        .arg_required_else_help(true)
        .subcommand(command!("build"))
        .subcommand(command!("e2e_test_web"))
        .subcommand(command!("dev_prfs_web").arg(arg!(--env <STR> "Environment")))
        .subcommand(command!("dev_asset_server"))
        .subcommand(command!("dev_api_server"))
        .subcommand(command!("seed_api_server"))
        .subcommand(command!("start_prfs_web"))
        .get_matches();

    let now = Utc::now();
    let timestamp = now.timestamp_millis().to_string();
    println!("Ci starts: {} ({})", now, timestamp);

    let ci_file = PATHS.curr_dir.join("ci");
    ci_file
        .try_exists()
        .expect("current dir may not be the project root");

    match matches.subcommand() {
        Some(("build", sub_matches)) => {
            let build_handle = BuildHandle { timestamp };

            let tasks: Vec<Box<dyn Task>> = vec![
                // Box::new(BuildWasmTask),
                Box::new(CompileCircuitsTask),
                // Box::new(BuildJsDependenciesTask),
                // Box::new(BuildPrfsJsTask),
            ];

            run_tasks(sub_matches, tasks, build_handle).expect("Ci failed");
        }
        Some(("e2e_test_web", sub_matches)) => {
            tasks::e2e_test_web::run(sub_matches);
        }
        Some(("dev_prfs_web", sub_matches)) => {
            tasks::dev_prfs_web::run(sub_matches);
        }
        Some(("start_prfs_web", sub_matches)) => {
            tasks::start_prfs_web::run(sub_matches);
        }
        Some(("dev_asset_server", sub_matches)) => {
            tasks::dev_asset_server::run(sub_matches);
        }
        Some(("dev_api_server", sub_matches)) => {
            tasks::dev_api_server::run(sub_matches);
        }
        Some(("seed_api_server", sub_matches)) => {
            tasks::seed_api_server::run(sub_matches);
        }
        _ => unreachable!("Subcommand not defined"),
    }
}

fn run_tasks(
    _matches: &ArgMatches,
    tasks: Vec<Box<dyn Task>>,
    mut build_handle: BuildHandle,
) -> Result<(), CiError> {
    for t in &tasks {
        println!(
            "\n{} executing task: {}",
            "Start".green().bold(),
            t.name().cyan().bold()
        );

        match t.run(&mut build_handle) {
            Ok(_) => (),
            Err(err) => {
                println!(
                    "Error executing task, {}, err: {}",
                    t.name(),
                    err.to_string()
                );

                return Err(err);
            }
        }
    }

    println!("\nSuccess building, tasks done: {}", tasks.len());

    Ok(())
}
