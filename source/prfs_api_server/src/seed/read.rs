use crate::{
    paths::PATHS,
    seed::json::{
        CircuitDriversJson, CircuitInputTypesJson, CircuitTypesJson, DynamicSetsJson,
        ProofTypesJson,
    },
};
use colored::Colorize;
use prfs_circuit_circom::{CircuitBuildJson, CircuitBuildListJson};
use prfs_entities::{
    entities::{
        PrfsCircuit, PrfsCircuitDriver, PrfsCircuitInputType, PrfsCircuitType, PrfsProofType,
        PrfsSet,
    },
    syn_entities::PrfsCircuitSyn1,
};
use serde::de::DeserializeOwned;
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

        let json: CircuitBuildJson = read_json(&circuit_build_json_path);

        if circuit_ids.contains(&json.circuit.circuit_id.to_string()) {
            panic!("Duplicate circuit id, build_json: {:?}", json);
        }

        let c = json.circuit;

        circuit_ids.insert(c.circuit_id.to_string());
        circuits.insert(circuit_name, c.clone());
    }

    circuits
}

pub fn load_circuit_drivers() -> HashMap<String, PrfsCircuitDriver> {
    println!("\n{} circuit drivers", "Loading".green());

    let json_path = PATHS.data.join("circuit_drivers.json");
    let json: CircuitDriversJson = read_json(&json_path);

    let mut m = HashMap::new();
    for pgm in json.circuit_drivers {
        m.insert(pgm.circuit_driver_id.to_string(), pgm.clone());
    }

    return m;
}

pub fn load_circuit_types() -> HashMap<String, PrfsCircuitType> {
    println!("\n{} circuit types", "Loading".green());

    let json_path = PATHS.data.join("circuit_types.json");
    let json: CircuitTypesJson = read_json(&json_path);

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
    let json: CircuitInputTypesJson = read_json(&json_path);

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
    let json: ProofTypesJson = read_json(&json_path);

    let mut m = HashMap::new();
    for proof_type in json.proof_types {
        println!("Reading proof type, name: {}", proof_type.proof_type_id);

        m.insert(proof_type.proof_type_id.to_string(), proof_type.clone());
    }

    m
}

pub fn load_dynamic_sets() -> HashMap<String, PrfsSet> {
    println!("\n{} dynamic sets", "Loading".green());

    let json_path = PATHS.data.join("dynamic_sets.json");
    let json: DynamicSetsJson = read_json(&json_path);

    let mut m = HashMap::new();
    for prfs_set in json.dynamic_sets {
        println!("Reading set, set_id: {}", prfs_set.set_id);

        m.insert(prfs_set.set_id.to_string(), prfs_set.clone());
    }

    m
}

fn read_json<T>(json_path: &PathBuf) -> T
where
    T: DeserializeOwned,
{
    let b = std::fs::read(&json_path).expect(&format!("file not exists, {:?}", json_path));
    let json: T = serde_json::from_slice(&b).unwrap();
    json
}
