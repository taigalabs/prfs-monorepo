use clap::{arg, command, Arg};
use prfs_circuit_circom::build;

fn main() {
    let matches = command!()
        .version("v0.1.0")
        .propagate_version(true)
        .arg_required_else_help(true)
        .arg(Arg::new("circuit_id").long("circuit-id").required(true))
        .get_matches();

    let starting_circuit_id = {
        let i = matches.get_one::<String>("circuit_id").unwrap();
        i.parse::<u32>().unwrap()
    };

    build::run(starting_circuit_id);
}
