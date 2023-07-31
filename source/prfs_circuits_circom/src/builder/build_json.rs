use prfs_circuit_type::{self, CircuitProgram};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::CircuitDetail;

#[derive(Serialize, Deserialize, Debug)]
pub struct CircuitBuildListJson {
    pub timestamp: i64,
    pub circuits: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitBuildJson {
    pub timestamp: i64,

    #[serde(flatten)]
    pub inner: CircuitDetail,
}
