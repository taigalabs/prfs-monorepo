use colored::Colorize;
use prfs_circuits_circom::{CircuitBuildJson, CircuitBuildListJson};
use std::{collections::HashMap, path::PathBuf};

pub struct LocalAssets {
    pub circuit_build: HashMap<String, CircuitBuildJson>,
}

pub fn load_local_assets() -> LocalAssets {
    let circuit_build = load_local_circuits();

    LocalAssets { circuit_build }
}

fn load_local_circuits() -> HashMap<String, CircuitBuildJson> {
    let build_list_json = prfs_circuits_circom::access::read_circuit_artifacts();

    let build_path = prfs_circuits_circom::access::get_build_fs_path();

    let mut circuit_build = HashMap::new();
    for circuit_name in build_list_json.circuits {
        let circuit_build_json_path = build_path.join(format!("{}/{}", circuit_name, "build.json"));
        let b = std::fs::read(circuit_build_json_path).unwrap();
        let build_json: CircuitBuildJson = serde_json::from_slice(&b).unwrap();

        circuit_build.insert(circuit_name, build_json);
    }

    circuit_build
}

fn load_local_circuit_program_types() {}
