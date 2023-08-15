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
