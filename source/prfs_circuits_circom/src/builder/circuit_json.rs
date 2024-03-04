use prfs_entities::entities::PrfsCircuit;
use serde::{Deserialize, Serialize};

pub enum FileKind {
    R1CS,
    Spartan,
    WtnsGen,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CircuitsJson {
    pub circuits: Vec<PrfsCircuit>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitBuild {
    pub circuit_type_id: String,
    pub r1cs_src_path: String,
    pub file_hash: String,
}
