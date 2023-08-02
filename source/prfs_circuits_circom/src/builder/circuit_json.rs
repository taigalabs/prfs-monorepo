use prfs_program_type::CircuitProgram;
use serde::{Deserialize, Serialize};

pub const SYSTEM_NATIVE_SCHEME: &str = "system_native://";

pub enum FileKind {
    R1CS,
    Spartan,
    WtnsGen,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CircuitsJson {
    pub circuits: Vec<CircuitJson>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitJson {
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
    pub program: CircuitProgram,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[allow(non_camel_case_types)]
pub enum PublicInputKind {
    PROVER_GENERATED,
    PRFS_SET,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PublicInput {
    pub r#type: PublicInputKind,
    pub label: String,
    pub desc: String,
}
