use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct PrfsProofRecord {
    pub serial_no: String,
    pub proof_starts_with: String,
    pub proof_action: String,
}
