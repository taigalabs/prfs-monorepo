use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct CircuitInputMeta {
    pub name: String,
    pub label: String,
    pub r#type: String,
    pub desc: String,

    #[serde(default = "default_show_priority")]
    pub show_priority: u8,

    #[serde(default = "default_ref")]
    pub r#ref: String,
}

fn default_ref() -> String {
    String::from("")
}

fn default_show_priority() -> u8 {
    3
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct CircuitInputType {
    pub circuit_input_type: String,
    pub properties_meta: Vec<CircuitInputTypeProperty>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct CircuitInputTypeProperty {
    pub name: String,
    pub label: String,
    pub desc: String,
    pub r#type: String,
    pub show_priority: u8,
}
