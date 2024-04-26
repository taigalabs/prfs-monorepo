use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{PrfsAtstGroup, PrfsAtstGroupId};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsAtstGroupsRequest {
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsAtstGroupsResponse {
    pub rows: Vec<PrfsAtstGroup>,
    pub next_offset: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ValidateGroupMembershipRequest {
    pub atst_group_id: PrfsAtstGroupId,
    pub member_code: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ValidateGroupMembershipResponse {
    pub is_valid: bool,
    pub label: String,
    pub error: Option<String>,
}
