use colored::Colorize;
use prfs_circuit_interface::circuit_types::CircuitTypeId;
use prfs_entities::{
    entities::{
        PrfsAccount, PrfsCircuit, PrfsCircuitDriver, PrfsCircuitInputType, PrfsCircuitType,
        PrfsPolicyItem, PrfsProofType,
    },
    PrfsAtstGroup,
};
use prfs_rust_utils::serde::read_json_file;
use std::collections::{HashMap, HashSet};

use crate::paths::PATHS;

pub fn load_circuits() -> HashMap<CircuitTypeId, PrfsCircuit> {
    println!("\n{} circuits", "Loading".green());

    let build_json = prfs_circuits_circom::access::read_circuit_artifacts();
    let build_path = prfs_circuits_circom::access::get_build_fs_path();

    let mut circuits = HashMap::new();
    let mut circuit_ids = HashSet::new();

    for (_, circuit) in build_json.circuits {
        let circuit_json_path =
            build_path.join(format!("{}/{}", circuit.circuit_type_id, "circuit.json"));

        println!("Reading circuit, json_path: {:?}", circuit_json_path,);

        let circuit_json: PrfsCircuit = read_json_file(&circuit_json_path).unwrap();

        if circuit_ids.contains(&circuit_json.circuit_id.to_string()) {
            panic!("Duplicate circuit id, circuit_json: {:?}", circuit_json);
        }

        circuit_ids.insert(circuit_json.circuit_id.to_string());
        circuits.insert(circuit.circuit_type_id, circuit_json.clone());
    }

    circuits
}

pub fn load_circuit_drivers() -> HashMap<String, PrfsCircuitDriver> {
    println!("\n{} circuit drivers", "Loading".green());

    let json_path = PATHS
        .data_seed__json_bindings
        .join("prfs_circuit_drivers.json");
    let circuit_drivers: Vec<PrfsCircuitDriver> = read_json_file(&json_path).unwrap();

    let mut m = HashMap::new();
    for pgm in circuit_drivers {
        m.insert(pgm.circuit_driver_id.to_string(), pgm.clone());
    }

    return m;
}

pub fn load_circuit_types() -> HashMap<String, PrfsCircuitType> {
    println!("\n{} circuit types", "Loading".green());

    let json_path = PATHS
        .data_seed__json_bindings
        .join("prfs_circuit_types.json");
    let circuit_types: Vec<PrfsCircuitType> = read_json_file(&json_path).unwrap();

    let mut m = HashMap::new();
    for circuit_type in circuit_types {
        println!("Reading circuit_type, id: {}", circuit_type.circuit_type_id);

        m.insert(
            circuit_type.circuit_type_id.to_string(),
            circuit_type.clone(),
        );
    }

    return m;
}

pub fn load_prfs_accounts() -> HashMap<String, PrfsAccount> {
    println!("\n{} circuit input types", "Loading".green());

    let json_path = PATHS.data_seed__json_bindings.join("prfs_accounts.json");
    let prfs_accounts: Vec<PrfsAccount> = read_json_file(&json_path).unwrap();

    let mut m = HashMap::new();
    for acc in prfs_accounts {
        println!("Reading account, id: {}", acc.account_id);

        m.insert(acc.account_id.to_string(), acc);
    }

    return m;
}

pub fn load_policy_items() -> HashMap<String, PrfsPolicyItem> {
    println!("\n{} prfs policy items", "Loading".green());

    let json_path = PATHS
        .data_seed__json_bindings
        .join("prfs_policy_items.json");
    let prfs_policy_items: Vec<PrfsPolicyItem> = read_json_file(&json_path).unwrap();

    let mut m = HashMap::new();
    for policy in prfs_policy_items {
        println!("Reading policy, id: {}", policy.policy_id);

        m.insert(policy.policy_id.to_string(), policy);
    }

    return m;
}

pub fn load_circuit_input_types() -> HashMap<String, PrfsCircuitInputType> {
    println!("\n{} circuit input types", "Loading".green());

    let json_path = PATHS
        .data_seed__json_bindings
        .join("prfs_circuit_input_types.json");
    let circuit_input_types: Vec<PrfsCircuitInputType> = read_json_file(&json_path).unwrap();

    let mut m = HashMap::new();
    for input_type in circuit_input_types {
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

    let json_path = PATHS.data_seed__json_bindings.join("prfs_proof_types.json");
    let proof_types: Vec<PrfsProofType> = read_json_file(&json_path).unwrap();

    let mut m = HashMap::new();
    for proof_type in proof_types {
        println!("Reading proof type, name: {}", proof_type.proof_type_id);

        m.insert(proof_type.proof_type_id.to_string(), proof_type.clone());
    }

    m
}

pub fn load_prfs_atst_groups() -> HashMap<String, PrfsAtstGroup> {
    let json_path = PATHS.data_seed__json_bindings.join("prfs_atst_groups.json");
    let rows: Vec<PrfsAtstGroup> = read_json_file(&json_path).unwrap();

    let mut m = HashMap::new();
    for row in rows {
        println!("Reading row, name: {}", row.atst_group_id);

        m.insert(row.atst_group_id.to_string(), row.clone());
    }

    m
}

pub fn load_prfs_atst_group_members() -> HashMap<String, PrfsAtstGroup> {
    println!("\n{} proof types", "Loading".green());

    let json_path = PATHS.data_seed__json_bindings.join("prfs_atst_groups.json");
    let rows: Vec<PrfsAtstGroup> = read_json_file(&json_path).unwrap();

    let mut m = HashMap::new();
    for row in rows {
        println!("Reading row, name: {}", row.atst_group_id);

        m.insert(row.atst_group_id.to_string(), row.clone());
    }

    m
}
