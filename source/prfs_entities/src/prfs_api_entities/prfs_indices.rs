use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct DatedPrfsIndex {
    pub label: String,
    pub value: String,
    pub serial_no: String,
    pub updated_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetLeastRecentPrfsIndexRequest {
    pub prfs_indices: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetLeastRecentPrfsIndexResponse {
    pub prfs_index: String,
}
