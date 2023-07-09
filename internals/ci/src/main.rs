mod build_status;
mod paths;
mod task;
mod tasks;

use build_status::BuildStatus;
use chrono::prelude::*;
use clap::{command, Arg, ArgAction};
use paths::Paths;
use std::env;
use task::Task;
use tasks::{
    build_js_dependencies::BuildJsDependenciesTask, build_prfs_js::BuildPrfsJsTask,
    build_wasm::BuildWasmTask, compile_circuits::CompileCircuitsTask,
    copy_circuit_assets::CopyProofAssetsTask, embed_prfs_wasm::EmbedPrfsWasmTask,
};

pub type CiError = Box<dyn std::error::Error + Sync + Send>;

fn main() {
    let matches = command!() // requires `cargo` feature
        .arg(Arg::new("operation").action(ArgAction::Append))
        .get_matches();

    let op = matches.get_one::<String>("operation").unwrap().clone();

    let now = Utc::now();
    println!("Ci now: {}", now);

    let paths = Paths::new();

    match op.as_str() {
        "build" => {
            let build_status = BuildStatus {
                timestamp: now.timestamp_millis().to_string(),
            };

            let tasks: Vec<Box<dyn Task>> = vec![
                Box::new(BuildWasmTask),
                Box::new(CopyProofAssetsTask),
                // Box::new(CompileCircuitsTask),
                // Box::new(BuildJsDependenciesTask),
                // Box::new(EmbedPrfsWasmTask),
                // Box::new(BuildPrfsJsTask),
            ];

            run_tasks(tasks, build_status, paths).expect("Ci failed");
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
    mut build_status: BuildStatus,
    paths: Paths,
) -> Result<(), CiError> {
    for t in &tasks {
        println!("Start executing task, t: {}", t.name());

        match t.run(&mut build_status, &paths) {
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

    println!("Success building, tasks done: {}", tasks.len());

    Ok(())
}
