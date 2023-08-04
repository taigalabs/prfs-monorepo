use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export)]
pub struct SpartanCircomDriverProperties {
    pub wtns_gen_url: String,
    pub circuit_url: String,
    pub instance_path: String,
}
