use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PrfsSet {
    pub id: Option<Decimal>,
    pub label: String,
    pub author: String,
    pub desc: String,
}

impl PrfsSet {
    pub fn table_name() -> &'static str {
        "prfs_sets"
    }
}
