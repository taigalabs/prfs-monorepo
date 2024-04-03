use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::PrfsAtstTypeId;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsAtstGroup {
    pub atst_group_id: String,
    pub atst_type_id: PrfsAtstTypeId,
    pub label: String,
    pub desc: String,
}
