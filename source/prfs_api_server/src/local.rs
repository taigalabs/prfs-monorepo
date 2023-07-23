use colored::Colorize;
use prfs_circuits_circom::BuildJson;

pub fn require_build_json() -> BuildJson {
    let build_json = prfs_circuits_circom::access::read_build_json();
    build_json
}

pub fn run_seed() {
    unimplemented!();
}
