use serde::{Deserialize, Serialize};
use ts_rs::TS;

pub const SPARTAN_CIRCOM_PROGRAM_TYPE: &str = "SPARTAN_CIRCOM_1";

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export)]
pub struct SpartanCircomProgramProperties {
    pub wtns_gen_url: String,
    pub circuit_url: String,
    pub instance_path: String,
}
