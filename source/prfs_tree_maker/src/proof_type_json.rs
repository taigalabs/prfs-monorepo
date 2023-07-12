use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ProofTypeJson {
    pub set_id: String,
    pub where_clause: String,
    pub tree_depth: u32,
}
