use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use strum_macros::{Display, EnumString};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsAtstGroupMember {
    pub atst_group_id: String,
    pub member_id: String,
    pub member_code: String,
    pub code_type: String,
    pub status: String,
}

#[derive(TS, Clone, Debug, Serialize, Deserialize, Type, EnumString, Display)]
#[ts(export)]
#[sqlx(type_name = "VARCHAR")]
pub enum PrfsAtstGroupMemberStatus {
    Valid,
}
