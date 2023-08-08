use prfs_entities::entities::{CircuitDriver, PrfsCircuit, PublicInput};
use serde::{Deserialize, Serialize};

pub const SYSTEM_NATIVE_SCHEME: &str = "system_native://";

pub enum FileKind {
    R1CS,
    Spartan,
    WtnsGen,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CircuitsJson {
    pub circuits: Vec<PrfsCircuit>,
}
