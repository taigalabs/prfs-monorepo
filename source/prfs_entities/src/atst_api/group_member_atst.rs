use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{atst_entities::PrfsAttestation, GroupMemberAtstMeta, PrfsAtstGroupId};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateGroupMemberAtstRequest {
    pub atst_id: String,
    pub atst_group_id: PrfsAtstGroupId,
    pub label: String,
    pub serial_no: String,
    pub cm: String,
    pub member_code: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
#[allow(non_snake_case)]
pub struct ComputeGroupMemberValueResponse {
    pub updated_row_count: u128,
}
