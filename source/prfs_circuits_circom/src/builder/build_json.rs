use prfs_circuit_interface::circuit_types::CircuitTypeId;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::CircuitBuild;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CircuitBuildJson {
    pub circuits: HashMap<CircuitTypeId, CircuitBuild>,
}
