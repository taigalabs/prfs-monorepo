use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize)]
#[ts(export)]
pub struct PrfsTreeNode {
    pub tree_id: String,
    pub set_id: String,
    #[ts(type = "number")]
    pub pos_w: Decimal,
    pub pos_h: i32,
    pub val: String,
    pub meta: Option<String>,
}

#[derive(TS, Debug, Serialize, Deserialize)]
#[ts(export)]
pub struct RawPrfsTreeNode {
    pub tree_id: String,
    pub set_id: String,
    #[ts(type = "number")]
    pub pos_w: Decimal,
    pub pos_h: i32,
    pub val: [u8; 32],
    pub meta: Option<String>,
}
