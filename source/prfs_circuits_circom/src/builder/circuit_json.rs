use crate::CircuitBuildJson;
use prfs_circuit_type::CircuitProgram;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use super::spartan_circom_program::PublicInput;

pub const SYSTEM_NATIVE_SCHEME: &str = "system_native://";

pub enum FileKind {
    // Source,
    R1CS,
    Spartan,
    WtnsGen,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CircuitsJson {
    pub circuits: Vec<CircuitBuildJson>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitDetail {
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
    pub program: serde_json::Value,
}
