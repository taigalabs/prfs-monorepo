use serde::{Deserialize, Serialize};
use sqlx::Type;
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, Type, TS)]
#[allow(non_camel_case_types)]
#[serde(rename_all = "snake_case")]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum CircuitDriverId {
    SpartanCircomV1,
}
