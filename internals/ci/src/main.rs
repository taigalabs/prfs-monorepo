mod paths;
mod task;
mod tasks;

use chrono::prelude::*;
use clap::{command, Arg, ArgAction, ArgMatches};
use colored::Colorize;
use paths::Paths;
use serde::{Deserialize, Serialize};
use std::env;
use task::Task;
use tasks::{
    build_js_dependencies::BuildJsDependenciesTask, build_prfs_js::BuildPrfsJsTask,
    build_wasm::BuildWasmTask, compile_circuits::CompileCircuitsTask,
};

pub type CiError = Box<dyn std::error::Error + Sync + Send>;

#[derive(Serialize, Deserialize)]
pub struct BuildHandle {
    pub timestamp: String,
}

fn main() {
    let matches = command!() // requires `cargo` feature
        .version("v0.1")
        .propagate_version(true)
        .arg_required_else_help(true)
        .subcommand(clap::Command::new("build"))
        .subcommand(clap::Command::new("e2e_test_web"))
        .subcommand(clap::Command::new("dev_prfs_web"))
        .subcommand(clap::Command::new("dev_asset_server"))
        .subcommand(clap::Command::new("dev_backend"))
        .subcommand(clap::Command::new("start_prfs_web"))
        .get_matches();

    let now = Utc::now();
    let timestamp = now.timestamp_millis().to_string();
    println!("Ci starts: {} ({})", now, timestamp);

    let paths = Paths::new();

    match matches.subcommand() {
        Some(("build", sub_matches)) => {
            let build_handle = BuildHandle { timestamp };

            let tasks: Vec<Box<dyn Task>> = vec![
                Box::new(BuildWasmTask),
                Box::new(CompileCircuitsTask),
                Box::new(BuildJsDependenciesTask),
                Box::new(BuildPrfsJsTask),
            ];

            run_tasks(sub_matches, tasks, build_handle, &paths).expect("Ci failed");
        }
        Some(("e2e_test_web", sub_matches)) => {
            tasks::e2e_test_web::run(sub_matches, &paths);
        }
        Some(("dev_prfs_web", sub_matches)) => {
            tasks::dev_prfs_web::run(sub_matches, &paths);
        }
        Some(("start_prfs_web", sub_matches)) => {
            tasks::start_prfs_web::run(sub_matches, &paths);
        }
        Some(("dev_asset_server", sub_matches)) => {
            tasks::dev_asset_server::run(sub_matches, &paths);
        }
        Some(("dev_backend", sub_matches)) => {
            tasks::dev_backend::run(sub_matches, &paths);
        }
        _ => unreachable!("Subcommand not defined"),
    }
}

fn run_tasks(
    _matches: &ArgMatches,
    tasks: Vec<Box<dyn Task>>,
    mut build_handle: BuildHandle,
    paths: &Paths,
) -> Result<(), CiError> {
    for t in &tasks {
        println!(
            "\n{} executing task: {}",
            "Start".green().bold(),
            t.name().cyan().bold()
        );

        match t.run(&mut build_handle, &paths) {
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
