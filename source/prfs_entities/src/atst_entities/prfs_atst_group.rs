use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsAtstGroup {
    pub atst_group_id: String,
    pub label: String,
    pub desc: String,
}
