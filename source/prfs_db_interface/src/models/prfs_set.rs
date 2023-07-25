use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PrfsSet {
    pub set_id: String,
    pub label: String,
    pub author: String,
    pub desc: String,
}

impl PrfsSet {
    pub fn _table_name() -> &'static str {
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
}
