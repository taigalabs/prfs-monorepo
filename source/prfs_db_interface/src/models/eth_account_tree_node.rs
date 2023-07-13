use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct EthAccountTreeNode {
    pub addr: String,
    pub set_id: String,
}

impl EthAccountTreeNode {
    pub fn table_name() -> &'static str {
        "eth_account_tree_node"
    }
}
