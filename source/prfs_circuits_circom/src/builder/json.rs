use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub const SYSTEM_NATIVE_SCHEME: &str = "system_native://";

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
    pub public_inputs: Vec<PublicInput>,
    pub instance_path: String,
    pub circuit_src_path: String,

    pub wtns_gen_url: String,
    pub spartan_circuit_url: String,
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
    pub public_inputs: Vec<PublicInput>,
    pub desc: String,
    pub circuit_dsl: String,
    pub arithmetization: String,
    pub proof_algorithm: String,
    pub elliptic_curve: String,
    pub finite_field: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum PublicInputKind {
    COMPUTED,
    SET,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PublicInput {
    pub label: String,
    pub desc: String,
    pub kind: PublicInputKind,
}
