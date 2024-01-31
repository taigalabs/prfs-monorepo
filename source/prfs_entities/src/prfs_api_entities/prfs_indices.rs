use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct DatedPrfsIndex {
    pub key: Option<String>,
    pub value: Option<String>,
    pub serial_no: Option<String>,
    pub updated_at: Option<DateTime<Utc>>,
    pub key2: String,
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

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsIndicesRequest {
    pub keys: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsIndicesResponse {
    pub prfs_indices: HashMap<String, String>,
}
