use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsIdSession {
    pub key: String,
    pub value: Vec<u8>,
    pub ticket: String,
}
