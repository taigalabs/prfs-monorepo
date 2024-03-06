use prfs_db_lib::sqlx;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct CircuitInputMeta {
    pub name: String,
    pub label: String,
    pub r#type: String,
    pub desc: String,

    #[serde(default = "default_ref_type")]
    pub ref_type: String,
}

fn default_ref_type() -> String {
    String::from("")
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsCircuitInputType {
    pub circuit_input_type: String,

    #[ts(type = "Record<string, any>[]")]
    pub properties_meta: sqlx::types::Json<Vec<CircuitInputTypeProperty>>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct CircuitInputTypeProperty {
    pub name: String,
    pub label: String,
    pub desc: String,
    pub r#type: String,
}
