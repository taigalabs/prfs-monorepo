use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsIndex {
    pub key: String,
    pub value: String,
    pub serial_no: String,
}
