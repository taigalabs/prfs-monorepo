use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct CircuitBuildListJson {
    pub circuits: Vec<String>,
    pub timestamp: String,
}
