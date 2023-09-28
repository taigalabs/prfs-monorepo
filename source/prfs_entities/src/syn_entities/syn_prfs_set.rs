use crate::entities::{CircuitInputMeta, PrfsSetType, RawCircuitInputMeta};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsSetIns1 {
    #[ts(type = "string")]
    pub set_id: Uuid,
    pub set_type: PrfsSetType,

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
}
