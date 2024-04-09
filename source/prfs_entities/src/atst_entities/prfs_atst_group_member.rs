use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use strum_macros::{Display, EnumString};
use ts_rs::TS;

use crate::{PrfsAtstGroupId, PrfsAtstMeta};

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsAtstGroupMember {
    pub atst_group_id: PrfsAtstGroupId,
    pub member_id: String,
    pub member_code: String,
    pub code_type: PrfsAtstGroupMemberCodeType,
    pub status: PrfsAtstGroupMemberStatus,
    #[ts(type = "Record<string, string>")]
    pub meta: sqlx::types::Json<PrfsAtstMeta>,
}

#[derive(TS, Clone, Debug, Serialize, Deserialize, Type, EnumString, Display, PartialEq, Eq)]
#[ts(export)]
#[sqlx(type_name = "VARCHAR")]
pub enum PrfsAtstGroupMemberCodeType {
    Equality,
}

#[derive(TS, Clone, Debug, Serialize, Deserialize, Type, EnumString, Display, PartialEq, Eq)]
#[ts(export)]
#[sqlx(type_name = "VARCHAR")]
pub enum PrfsAtstGroupMemberStatus {
    Registered,
    NotRegistered,
}
