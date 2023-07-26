use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub enum FileKind {
    Source,
    R1CS,
    Spartan,
    WtnsGen,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BuildJson {
    pub timestamp: String,
    pub circuit_builds: HashMap<String, CircuitBuildDetail>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitBuildDetail {
    pub circuit_id: String,
    pub label: String,
    pub desc: String,
    pub created_at: String,
    pub author: String,
    pub circuit_dsl: String,
    pub arithmetization: String,
    pub proof_algorithm: String,
    pub elliptic_curve: String,
    pub finite_field: String,
    pub num_public_inputs: usize,

    pub instance_path: String,
    pub circuit_src_path: String,
    pub wtns_gen_path: String,
    pub spartan_circuit_path: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CircuitsJson {
    pub circuits: HashMap<String, CircuitDetail>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CircuitDetail {
    pub circuit_id: String,
    pub label: String,
    pub instance_path: String,
    pub author: String,
    pub num_public_inputs: usize,
    pub desc: String,
    pub circuit_dsl: String,
    pub arithmetization: String,
    pub proof_algorithm: String,
    pub elliptic_curve: String,
    pub finite_field: String,
}
