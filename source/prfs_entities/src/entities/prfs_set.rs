use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx;
// use strum_macros::EnumString;
use ts_rs::TS;
use uuid::Uuid;

#[derive(TS, Debug, Serialize, Deserialize)]
#[ts(export)]
pub struct PrfsSet {
    #[ts(type = "string")]
    pub set_id: Uuid,
    pub set_type: PrfsSetType,

    pub label: String,
    pub author: String,
    pub desc: String,
    pub hash_algorithm: String,
    pub cardinality: i64,
    pub merkle_root: String,
    pub element_type: String,
    pub finite_field: String,
    pub elliptic_curve: String,

    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,
}

#[derive(TS, Debug, Serialize, Deserialize, sqlx::Type)]
#[ts(export)]
#[sqlx(type_name = "set_type")]
pub enum PrfsSetType {
    Static,
    Dynamic,
}
