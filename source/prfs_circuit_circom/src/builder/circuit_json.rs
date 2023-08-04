use prfs_circuit_type::PublicInput;
use prfs_driver_type::drivers::circuit_driver::CircuitDriver;
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
    pub driver: CircuitDriver,
}
