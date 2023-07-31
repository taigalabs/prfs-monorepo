use crate::PublicInput;
use prfs_circuit_type::{self, CircuitProgram};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct BuildJson {
    pub timestamp: String,
    pub circuit_builds: HashMap<String, CircuitBuildDetail>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitBuildDetail {
    pub timestamp: i64,
    pub circuit_id: String,
    pub label: String,
    pub desc: String,
    pub created_at: String,
    pub author: String,
    pub circuit_dsl: String,
    pub arithmetization: String,
    pub proof_algorithm: String,
    pub elliptic_curve: String,
    pub finite_field: String,
    pub public_inputs: Vec<PublicInput>,
    pub instance_path: String,
    pub circuit_src_path: String,
    pub program: CircuitProgram,

    pub wtns_gen_url: String,
    pub spartan_circuit_url: String,
}
