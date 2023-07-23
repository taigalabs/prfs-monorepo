use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct EthTreeNode {
    pub pos_w: Decimal,
    pub pos_h: i32,
    pub val: String,
    pub set_id: String,
}

impl EthTreeNode {
    pub fn table_name() -> &'static str {
        "eth_tree_nodes"
    }
}
