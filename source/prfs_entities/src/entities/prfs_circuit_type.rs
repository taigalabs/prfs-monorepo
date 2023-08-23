use super::CircuitInputMeta;
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
    pub circuit_inputs_meta: sqlx::types::Json<Vec<CircuitInputMeta>>,

    pub prioritized_input_type_names: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct DriverPropertyMeta {
    pub label: String,
    pub r#type: String,
    pub desc: String,
}
