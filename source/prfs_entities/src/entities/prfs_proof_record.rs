use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct PrfsProofRecord {
    pub public_key: String,
    pub serial_no: String,
    pub proof_starts_with: Vec<u8>,
}