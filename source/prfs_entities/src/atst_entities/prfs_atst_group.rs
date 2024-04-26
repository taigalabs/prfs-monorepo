use serde::{Deserialize, Serialize};
use sqlx::Type;
use strum_macros::Display;
use ts_rs::TS;

use crate::PrfsAtstGroupId;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsAtstGroup {
    pub atst_group_id: PrfsAtstGroupId,
    pub label: String,
    pub desc: String,
    pub group_type: PrfsAtstGroupType,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type, TS, Display, PartialEq, Eq, Hash)]
#[allow(non_camel_case_types)]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum PrfsAtstGroupType {
    group_member_v1,
    generic,
}
