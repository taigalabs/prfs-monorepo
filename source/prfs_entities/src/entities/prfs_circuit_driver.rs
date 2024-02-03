use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsCircuitDriver {
    pub circuit_driver_id: String,
    pub label: String,
    pub driver_repository_url: String,
    pub version: String,
    pub author: String,
    pub desc: String,

    #[ts(type = "string[]")]
    pub circuit_type_ids: sqlx::types::Json<Vec<String>>,

    #[ts(type = "Record<string, any>[]")]
    pub driver_properties_meta: sqlx::types::Json<Vec<DriverPropertyMeta>>,

    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct DriverPropertyMeta {
    pub label: String,
    pub r#type: String,
    pub desc: String,
}
