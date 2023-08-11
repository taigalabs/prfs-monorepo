use colored::Colorize;
use prfs_circuit_circom::{CircuitBuildJson, CircuitBuildListJson};
use prfs_circuit_type::local::access::load_system_native_circuit_types;
use prfs_driver_type::local::access::load_system_native_driver_types;
use prfs_entities::entities::{CircuitDriver, CircuitType};
use std::{collections::HashMap, path::PathBuf};

pub struct LocalAssets {
    pub circuits: HashMap<String, CircuitBuildJson>,
    pub drivers: HashMap<String, CircuitDriver>,
    pub circuit_types: HashMap<String, CircuitType>,
}

pub fn load_local_assets() -> LocalAssets {
    let circuits = load_circuits();
    let drivers = load_driver_types();
    let circuit_types = load_circuit_types();

    LocalAssets {
        circuits,
        drivers,
        circuit_types,
    }
}

fn load_circuits() -> HashMap<String, CircuitBuildJson> {
    let build_list_json = prfs_circuit_circom::access::read_circuit_artifacts();

    let build_path = prfs_circuit_circom::access::get_build_fs_path();

    let mut circuit_build = HashMap::new();
    for circuit_name in build_list_json.circuits {
        let circuit_build_json_path = build_path.join(format!("{}/{}", circuit_name, "build.json"));
        println!(
            "Reading circuit, name: {:?}",
            circuit_build_json_path.file_name()
        );

        let b = std::fs::read(circuit_build_json_path).unwrap();
        let build_json: CircuitBuildJson = serde_json::from_slice(&b).unwrap();

        circuit_build.insert(circuit_name, build_json);
    }

    circuit_build
}

fn load_driver_types() -> HashMap<String, CircuitDriver> {
    let drivers_json = load_system_native_driver_types();

    let mut m = HashMap::new();
    for pgm in drivers_json.drivers {
        m.insert(pgm.driver_id.to_string(), pgm.clone());
    }

    return m;
}

fn load_circuit_types() -> HashMap<String, CircuitType> {
    let circuit_types_json = load_system_native_circuit_types();

    let mut m = HashMap::new();
    for circuit_type in circuit_types_json.circuit_types {
        m.insert(circuit_type.circuit_type.to_string(), circuit_type.clone());
    }

    return m;
}
