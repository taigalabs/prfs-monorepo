use clap::{arg, command, Arg};
use prfs_circuit_circom::build;

fn main() {
    let _matches = command!()
        .version("v0.1.0")
        .propagate_version(true)
        .arg_required_else_help(true)
        .get_matches();

    build::run();
}
