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
    pub meta: Option<String>,

    #[ts(type = "string")]
    pub set_id: uuid::Uuid,
}
