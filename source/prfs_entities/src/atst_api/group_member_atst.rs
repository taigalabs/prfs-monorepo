use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{atst_entities::PrfsAttestation, PrfsAtstTypeId};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateGroupMemberAtstRequest {
    pub atst_id: String,
    pub atst_type_id: PrfsAtstTypeId,
    pub label: String,
    pub serial_no: String,
    pub cm: String,
    pub atst_group_id: String,
    pub member_code: String,
    // pub cm_msg: Vec<u8>,
    // pub sig: String,
}
