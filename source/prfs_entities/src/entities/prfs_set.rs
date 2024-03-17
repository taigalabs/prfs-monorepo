use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};
use ts_rs::TS;

#[derive(TS, Clone, Debug, Serialize, Deserialize)]
#[ts(export)]
pub struct PrfsSet {
    pub set_id: String,
    // pub set_type: PrfsSetType,
    pub label: String,
    pub author: String,
    pub desc: String,
    pub hash_algorithm: String,
    pub cardinality: i64,
    pub element_type: String,
    pub topic: String,

    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}

// #[derive(TS, Clone, Debug, Serialize, Deserialize, sqlx::Type, EnumString, Display)]
// #[ts(export)]
// #[sqlx(type_name = "VARCHAR")]
// pub enum PrfsSetType {
//     Static,
//     Dynamic,
// }
