use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitDriver {
    pub driver_id: String,
    pub driver_repository_url: String,
    pub version: String,
    pub properties: serde_json::Value,
}
