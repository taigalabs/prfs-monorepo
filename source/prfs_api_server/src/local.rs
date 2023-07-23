use colored::Colorize;
use prfs_circuits_circom::BuildJson;

pub fn require_local_assets() -> BuildJson {
    let build_json = prfs_circuits_circom::access::read_build_json();

    // for circuit in &build_json.circuit_builds {
    //     println!("{} circuit: {}", "Loading".green(), circuit.name);
    // }

    build_json
}
