use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::PrfsAtstGroupId;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsAtstGroup {
    pub atst_group_id: PrfsAtstGroupId,
    pub label: String,
    pub desc: String,
}
