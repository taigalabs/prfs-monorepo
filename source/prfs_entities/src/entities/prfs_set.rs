use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};
use ts_rs::TS;

use crate::PrfsAtstTypeId;

#[derive(TS, Clone, Debug, Serialize, Deserialize)]
#[ts(export)]
pub struct PrfsSet {
    pub set_id: String,
    pub label: String,
    pub author: String,
    pub desc: String,
    pub hash_algorithm: String,
    pub cardinality: i64,
    pub element_type: String,
    pub atst_type_id: PrfsAtstTypeId,

    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}
