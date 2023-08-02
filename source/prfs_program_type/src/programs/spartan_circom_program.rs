use serde::{Deserialize, Serialize};

pub const SPARTAN_CIRCOM_PROGRAM_TYPE: &str = "SPARTAN_CIRCOM_1";

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SpartanCircomProgramProperties {
    pub wtns_gen_url: String,
    pub circuit_url: String,
    pub instance_path: String,
}
