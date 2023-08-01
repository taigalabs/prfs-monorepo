use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ProgramsJson {
    pub programs: Vec<CircuitProgram>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitProgram {
    pub program_id: String,
    pub program_repository_url: String,
    pub version: String,
    pub properties: serde_json::Value,
}
