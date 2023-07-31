use prfs_circuit_type::CircuitProgram;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub const SYSTEM_NATIVE_SCHEME: &str = "system_native://";

pub enum FileKind {
    Source,
    R1CS,
    Spartan,
    WtnsGen,
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

    #[serde(flatten)]
    pub program: CircuitProgram,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[allow(non_camel_case_types)]
pub enum PublicInputKind {
    COMPUTED,
    PRFS_SET,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PublicInput {
    pub label: String,
    pub desc: String,
    pub r#type: PublicInputKind,
}
