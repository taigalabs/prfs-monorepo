use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct CircuitType {
    pub circuit_type: String,
    pub desc: String,
    pub author: String,

    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,

    #[ts(type = "Record<string, any>[]")]
    pub driver_inputs_meta: sqlx::types::Json<Vec<DriverInputMeta>>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct DriverInputMeta {
    pub r#type: String,
    pub label: String,
    pub desc: String,

    #[serde(default = "default_ref")]
    pub r#ref: String,
}

fn default_ref() -> String {
    String::from("")
}
