use prfs_entities::entities::PrfsCircuit;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct CircuitBuildListJson {
    // pub circuit_version: String,
    pub circuits: Vec<String>,
}

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct CircuitBuildJson {
//     // pub circuit_version: String,
//     pub circuit: PrfsCircuit,
// }
