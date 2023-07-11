use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AccountNode {
    pub addr: String,
    pub set_id: String,
}

impl AccountNode {
    pub fn table_name() -> &'static str {
        "account_node"
    }
}
