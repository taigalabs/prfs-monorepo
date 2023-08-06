use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize)]
#[ts(export)]
pub struct PrfsTreeNode {
    #[ts(type = "number")]
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
