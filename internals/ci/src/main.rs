mod build_status;
mod paths;
mod task;
mod tasks;

use build_status::BuildStatus;
use chrono::prelude::*;
use clap::{command, Arg, ArgAction};
use std::env;
use task::Task;
use tasks::{
    build_js_dependencies::BuildJsDependenciesTask, build_wasm::BuildWasmTask,
    compile_circuits::CompileCircuitsTask, copy_circuit_assets::CopyProofAssetsTask,
};

pub type CiError = Box<dyn std::error::Error + Sync + Send>;

fn main() {
    let matches = command!() // requires `cargo` feature
        .arg(Arg::new("operation").action(ArgAction::Append))
        .get_matches();

    let op = matches.get_one::<String>("operation").unwrap().clone();

    let now = Utc::now();

    match op.as_str() {
        "build" => {
            let build_status = BuildStatus {
                timestamp: now.to_string(),
            };

            let tasks: Vec<Box<dyn Task>> = vec![
                Box::new(BuildWasmTask),
                Box::new(CopyProofAssetsTask),
                Box::new(CompileCircuitsTask),
                Box::new(BuildJsDependenciesTask),
                // Box::new(Embed),
                Box::new(BuildJsDependenciesTask),
            ];

            run_tasks(tasks, build_status).expect("Ci failed");

            // tasks::build_wasm::run(&mut build_status);
            // tasks::copy_circuit_assets::copy_circuit_assets();

            // // tasks::compile_circuits::compile_circuits();
            // tasks::build_js_dependencies::build_js_dependencies();

            // tasks::embed_prfs_wasm::embed_prfs_wasm();
            // tasks::build_prfs_js::build_prfs_js();
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

fn run_tasks(tasks: Vec<Box<dyn Task>>, mut build_status: BuildStatus) -> Result<(), CiError> {
    for t in tasks {
        match t.run(&mut build_status) {
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

    Ok(())
}
