use crate::{
    paths::PATHS,
    seed::json::{CircuitDriversJson, CircuitInputTypesJson, CircuitTypesJson, ProofTypesJson},
};
use colored::Colorize;
use prfs_circuit_circom::{CircuitBuildJson, CircuitBuildListJson};
use prfs_entities::{
    entities::{
        PrfsCircuit, PrfsCircuitDriver, PrfsCircuitInputType, PrfsCircuitType, PrfsProofType,
    },
    syn_entities::PrfsCircuitSyn1,
};
use std::{
    collections::{HashMap, HashSet},
    path::PathBuf,
};

pub fn load_circuits() -> HashMap<String, PrfsCircuit> {
    let build_list_json = prfs_circuit_circom::access::read_circuit_artifacts();
    let build_path = prfs_circuit_circom::access::get_build_fs_path();

    let mut circuits = HashMap::new();
    let mut circuit_ids = HashSet::new();

    for circuit_name in build_list_json.circuits {
        let circuit_build_json_path = build_path.join(format!("{}/{}", circuit_name, "build.json"));
        println!(
            "Reading circuit, name: {:?}",
            circuit_build_json_path.file_name()
        );

        let b = std::fs::read(circuit_build_json_path).unwrap();
        let build_json: CircuitBuildJson = serde_json::from_slice(&b).unwrap();

        if circuit_ids.contains(&build_json.circuit.circuit_id.to_string()) {
            panic!("Duplicate circuit id, build_json: {:?}", build_json);
        }

        let c = build_json.circuit;

        circuit_ids.insert(c.circuit_id.to_string());
        circuits.insert(circuit_name, c.clone());
    }

    circuits
}

pub fn load_circuit_drivers() -> HashMap<String, PrfsCircuitDriver> {
    println!("\n{} circuit drivers", "Loading".green());

    // let drivers_json = load_system_native_driver_types();
    let json_path = PATHS.data.join("circuit_drivers.json");
    let b = std::fs::read(&json_path).expect(&format!("file not exists, {:?}", json_path));
    let json: CircuitDriversJson = serde_json::from_slice(&b).unwrap();

    let mut m = HashMap::new();
    for pgm in json.circuit_drivers {
        m.insert(pgm.circuit_driver_id.to_string(), pgm.clone());
    }

    return m;
}

pub fn load_circuit_types() -> HashMap<String, PrfsCircuitType> {
    println!("\n{} circuit types", "Loading".green());

    let json_path = PATHS.data.join("circuit_types.json");
    let b = std::fs::read(&json_path).expect(&format!("file not exists, {:?}", json_path));
    let json: CircuitTypesJson = serde_json::from_slice(&b).unwrap();

    let mut m = HashMap::new();
    for circuit_type in json.circuit_types {
        println!("Reading circuit_type, name: {}", circuit_type.circuit_type);

        m.insert(circuit_type.circuit_type.to_string(), circuit_type.clone());
    }

    return m;
}

pub fn load_circuit_input_types() -> HashMap<String, PrfsCircuitInputType> {
    println!("\n{} circuit input types", "Loading".green());

    let json_path = PATHS.data.join("circuit_input_types.json");
    let b = std::fs::read(&json_path).expect(&format!("file not exists, {:?}", json_path));
    let json: CircuitInputTypesJson = serde_json::from_slice(&b).unwrap();

    let mut m = HashMap::new();
    for input_type in json.circuit_input_types {
        println!(
            "Reading input_type, name: {}",
            input_type.circuit_input_type
        );

        m.insert(
            input_type.circuit_input_type.to_string(),
            input_type.clone(),
        );
    }

    return m;
}

pub fn load_proof_types() -> HashMap<String, PrfsProofType> {
    println!("\n{} proof types", "Loading".green());

    let json_path = PATHS.data.join("proof_types.json");
    let b = std::fs::read(&json_path).expect(&format!("file not exists, {:?}", json_path));
    let json: ProofTypesJson = serde_json::from_slice(&b).unwrap();

    let mut m = HashMap::new();
    for proof_type in json.proof_types {
        println!("Reading proof type, name: {}", proof_type.proof_type_id);

        m.insert(proof_type.proof_type_id.to_string(), proof_type.clone());
    }

    m
}
