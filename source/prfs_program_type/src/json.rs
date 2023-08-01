use serde::{Deserialize, Serialize};

pub const SPARTAN_CIRCOM_PROGRAM_TYPE: &str = "SPARTAN_CIRCOM_1";

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ProgramsJson {
    pub programs: Vec<CircuitProgram>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitProgram {
    program_id: String,
    program_repository_url: String,
    version: String,
    requirements: serde_json::Value,
}
