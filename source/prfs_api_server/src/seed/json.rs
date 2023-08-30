use prfs_entities::entities::{PrfsCircuitDriver, PrfsProofType, PrfsSet};
use prfs_entities::entities::{PrfsCircuitInputType, PrfsCircuitType};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitDriversJson {
    pub circuit_drivers: Vec<PrfsCircuitDriver>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitTypesJson {
    pub circuit_types: Vec<PrfsCircuitType>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitInputTypesJson {
    pub circuit_input_types: Vec<PrfsCircuitInputType>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ProofTypesJson {
    pub proof_types: Vec<PrfsProofType>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DynamicSetsJson {
    pub dynamic_sets: Vec<PrfsSet>,
}
