use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsIndex {
    pub label: String,
    pub value: String,
    pub serial_no: String,
}
