use crate::CircuitJson;
use prfs_program_type::{self, CircuitProgram};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct CircuitBuildListJson {
    pub timestamp: i64,
    pub circuits: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitBuildJson {
    pub timestamp: i64,

    #[serde(flatten)]
    pub inner: CircuitJson,
}
