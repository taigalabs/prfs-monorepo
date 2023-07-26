use chrono::NaiveDate;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PrfsSet {
    pub set_id: String,
    pub label: String,
    pub author: String,
    pub desc: String,
    pub hash_algorithm: String,
    pub cardinality: i64,
    pub created_at: NaiveDate,
    pub merkle_root: String,
    pub element_type: String,
}

impl PrfsSet {
    pub fn __table_name() -> &'static str {
        "prfs_sets"
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
}
