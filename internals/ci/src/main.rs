mod paths;
mod task;
mod tasks;

use chrono::prelude::*;
use clap::{command, Arg, ArgAction};
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
        .arg(Arg::new("operation").action(ArgAction::Append))
        .get_matches();

    let op = matches.get_one::<String>("operation").unwrap().clone();

    let now = Utc::now();
    let timestamp = now.timestamp_millis().to_string();
    println!("Ci starts: {} ({})", now, timestamp);

    let paths = Paths::new();

    match op.as_str() {
        "build" => {
            let build_handle = BuildHandle { timestamp };

            let tasks: Vec<Box<dyn Task>> = vec![
                Box::new(BuildWasmTask),
                // Box::new(CompileCircuitsTask),
                // Box::new(BuildJsDependenciesTask),
                // Box::newBuildPrfsJsTask),
            ];

            run_tasks(tasks, build_handle, paths).expect("Ci failed");
        }
        "e2e_test_node" => {
            tasks::e2e_test_web::run();
        }
        "dev_prfs_web" => {
            // tasks::build_prfs_js::build_prfs_js();
            tasks::dev_prfs_web::run();
        }
        "dev_circuit_server" => {
            tasks::dev_asset_server::run();
        }
        _ => {
            panic!(
                "[ci] Could not find the operation. Did you mean 'build'?, op: {}",
                op
            );
        }
    }
}

fn run_tasks(
    tasks: Vec<Box<dyn Task>>,
    mut build_handle: BuildHandle,
    paths: Paths,
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
