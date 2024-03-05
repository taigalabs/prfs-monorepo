use serde::{Deserialize, Serialize};

use crate::CircuitBuild;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CircuitBuildListJson {
    pub circuits: Vec<CircuitBuild>,
}
