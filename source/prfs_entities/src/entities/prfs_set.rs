use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize)]
#[ts(export)]
pub struct PrfsSet {
    pub set_id: String,
    pub label: String,
    pub author: String,
    pub desc: String,
    pub hash_algorithm: String,
    pub cardinality: i64,
    pub merkle_root: String,
    pub element_type: String,
    pub finite_field: String,
    pub elliptic_curve: String,

    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,
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

    pub fn finite_field() -> &'static str {
        "finite_field"
    }

    pub fn elliptic_curve() -> &'static str {
        "elliptic_curve"
    }
}
