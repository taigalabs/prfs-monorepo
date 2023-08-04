use colored::Colorize;
use prfs_circuit_circom::{CircuitBuildJson, CircuitBuildListJson};
use prfs_driver_type::CircuitProgram;
use std::{collections::HashMap, path::PathBuf};

pub struct LocalAssets {
    pub circuits: HashMap<String, CircuitBuildJson>,
    pub programs: HashMap<String, CircuitProgram>,
}

pub fn load_local_assets() -> LocalAssets {
    let circuits = load_circuits();

    let programs = load_program_types();

    LocalAssets { circuits, programs }
}

fn load_circuits() -> HashMap<String, CircuitBuildJson> {
    let build_list_json = prfs_circuit_circom::access::read_circuit_artifacts();

    let build_path = prfs_circuit_circom::access::get_build_fs_path();

    let mut circuit_build = HashMap::new();
    for circuit_name in build_list_json.circuits {
        let circuit_build_json_path = build_path.join(format!("{}/{}", circuit_name, "build.json"));
        let b = std::fs::read(circuit_build_json_path).unwrap();
        let build_json: CircuitBuildJson = serde_json::from_slice(&b).unwrap();

        circuit_build.insert(circuit_name, build_json);
    }

    circuit_build
}

fn load_program_types() -> HashMap<String, CircuitProgram> {
    let programs_json = prfs_driver_type::access::load_system_native_program_types();

    let mut m = HashMap::new();
    for pgm in programs_json.programs {
        m.insert(pgm.program_id.to_string(), pgm.clone());
    }

    return m;
}
