use super::DriverPropertyMeta;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;
use uuid::Uuid;

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
    pub circuit_types: sqlx::types::Json<Vec<String>>,

    #[ts(type = "Record<string, any>[]")]
    pub driver_properties_meta: sqlx::types::Json<Vec<DriverPropertyMeta>>,

    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,
}
