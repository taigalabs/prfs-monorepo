mod tasks;

use clap::{command, Arg, ArgAction};
use std::env;

fn main() {
    let matches = command!() // requires `cargo` feature
        .arg(Arg::new("operation").action(ArgAction::Append))
        .get_matches();

    let op = matches.get_one::<String>("operation").unwrap().clone();

    match op.as_str() {
        "build" => {
            tasks::build_wasm::build_wasm();
            tasks::copy_circuit_assets::copy_circuit_assets();
            // tasks::compile_circuits::compile_circuits();
            tasks::embed_prfs_wasm::embed_prfs_wasm();
            tasks::build_prfs_js::build_prfs_js();
        }
        "e2e_test_node" => {
            tasks::e2e_test_node::run();
        }
        "dev_prfs_web" => {
            tasks::build_prfs_js::build_prfs_js();
            tasks::dev_prfs_web::run();
        }
        "dev_circuit_server" => {
            tasks::dev_circuit_server::run();
        }
        _ => {
            panic!(
                "[ci] Could not find the operation. Did you mean 'build'?, op: {}",
                op
            );
        }
    }
}
