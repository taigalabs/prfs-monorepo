use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PrfsSet {
    pub proof_type_id: String,
    pub label: String,
    pub author: String,
    pub desc: String,

    pub created_at: NaiveDate,
    pub circuit_id: String,
}

impl PrfsSet {
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

    pub fn hash_algorithm() -> &'static str {
        "hash_algorithm"
    }

    pub fn cardinality() -> &'static str {
        "cardinality"
    }

    pub fn merkle_root() -> &'static str {
        "merkle_root"
    }

    pub fn element_type() -> &'static str {
        "element_type"
    }

    pub fn finite_field() -> &'static str {
        "finite_field"
    }

    pub fn elliptic_curve() -> &'static str {
        "elliptic_curve"
    }
}
