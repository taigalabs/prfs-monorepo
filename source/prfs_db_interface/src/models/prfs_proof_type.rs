use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PrfsProofType {
    pub proof_type_id: String,
    pub label: String,
    pub author: String,
    pub desc: String,

    pub created_at: NaiveDate,
    pub circuit_id: String,
    pub public_inputs: String,
}

impl PrfsProofType {
    pub fn __table_name() -> &'static str {
        "prfs_proof_types"
    }

    pub fn set_id() -> &'static str {
        "set_id"
    }

    pub fn label() -> &'static str {
        "label"
    }

    pub fn author() -> &'static str {
        "author"
    }

    pub fn desc() -> &'static str {
        "desc"
    }

    pub fn created_at() -> &'static str {
        "created_at"
    }

    pub fn circuit_id() -> &'static str {
        "circuit_id"
    }

    pub fn public_inputs() -> &'static str {
        "public_inputs"
    }
}
