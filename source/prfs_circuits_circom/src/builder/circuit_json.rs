use prfs_circuit_interface::circuit_types::CircuitTypeId;
use prfs_entities::entities::PrfsCircuit;
use serde::{Deserialize, Serialize};

pub enum FileKind {
    R1CS,
    Spartan,
    WtnsGen,
    WtnsGenRenamed,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CircuitsJson {
    pub circuits: Vec<PrfsCircuit>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitBuild {
    pub circuit_id: String,
    pub circuit_type_id: CircuitTypeId,
    pub r1cs_src_path: String,
    pub file_hash: String,
}
