use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PrfsTreeNode {
    pub pos_w: Decimal,
    pub pos_h: i32,
    pub val: String,
    pub set_id: String,
}

impl PrfsTreeNode {
    pub fn table_name() -> &'static str {
        "prfs_tree_nodes"
    }
}
