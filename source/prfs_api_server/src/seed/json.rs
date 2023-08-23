use prfs_entities::entities::PrfsCircuitDriver;
use prfs_entities::entities::{CircuitInputType, CircuitType};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DriversJson {
    pub drivers: Vec<PrfsCircuitDriver>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitTypesJson {
    pub circuit_types: Vec<CircuitType>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitInputTypesJson {
    pub circuit_input_types: Vec<CircuitInputType>,
}
