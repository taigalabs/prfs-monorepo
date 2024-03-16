use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsTree {
    pub label: String,
    pub tree_id: String,
    pub set_id: String,
    pub merkle_root: String,
    pub tree_depth: i16,
    pub finite_field: String,
    pub elliptic_curve: String,
}
