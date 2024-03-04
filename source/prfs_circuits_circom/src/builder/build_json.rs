use serde::{Deserialize, Serialize};

use crate::CircuitBuild;

#[derive(Serialize, Deserialize, Debug)]
pub struct CircuitBuildListJson {
    pub circuits: Vec<CircuitBuild>,
}
