use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::PrfsAtstType;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct UpdatePrfsTreeByNewAtstRequest {
    pub atst_type: PrfsAtstType,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct UpdatePrfsTreeByNewAtstResponse {
    pub prfs_set_ids: Vec<String>,
}
