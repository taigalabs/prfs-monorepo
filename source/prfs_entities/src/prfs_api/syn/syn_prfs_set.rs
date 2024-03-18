use crate::entities::{CircuitInputMeta, RawCircuitInputMeta};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsSetIns1 {
    pub set_id: String,
    // pub set_type: PrfsSetType,
    pub label: String,
    pub author: String,
    pub desc: String,
    pub hash_algorithm: String,
    pub cardinality: i64,
    pub merkle_root: String,
    pub tree_depth: i16,
    pub element_type: String,
    pub finite_field: String,
    pub elliptic_curve: String,
    pub topic: String,
}
