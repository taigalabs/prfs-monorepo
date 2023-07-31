use serde::{Deserialize, Serialize};

pub const SPARTAN_CIRCOM_PROGRAM_TYPE: &str = "SPARTAN_CIRCOM_1";

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SpartanCircomProgram {
    pub r#type: String,
    pub wtns_gen_url: String,
    pub circuit_url: String,
    pub instance_path: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[allow(non_camel_case_types)]
pub enum PublicInputKind {
    COMPUTED,
    PRFS_SET,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PublicInput {
    pub r#type: PublicInputKind,
    pub label: String,
    pub desc: String,
}
