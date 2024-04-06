use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use strum_macros::{Display, EnumString};
use ts_rs::TS;

use crate::PrfsAtstGroupId;

#[derive(TS, Clone, Debug, Serialize, Deserialize)]
#[ts(export)]
pub struct PrfsSet {
    pub set_id: String,
    pub label: String,
    pub author: String,
    pub desc: String,
    pub hash_algorithm: String,
    pub cardinality: i64,
    pub element_type: PrfsSetElementType,
    pub atst_group_id: PrfsAtstGroupId,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type, TS, Display, PartialEq, Eq, Hash)]
#[allow(non_camel_case_types)]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum PrfsSetElementType {
    wallet_addr,
    member_id,
}
