use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use strum_macros::{Display, EnumString};
use ts_rs::TS;

#[derive(TS, Clone, Debug, Serialize, Deserialize, Type, EnumString, Display)]
#[ts(export)]
#[allow(non_camel_case_types)]
#[sqlx(type_name = "VARCHAR")]
pub enum PrfsAtstVersion {
    v0_1,
    v0_2,
}
