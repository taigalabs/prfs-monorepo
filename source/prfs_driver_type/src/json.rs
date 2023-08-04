use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DriversJson {
    pub drivers: Vec<CircuitDriver>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitDriver {
    pub driver_id: String,
    pub driver_repository_url: String,
    pub version: String,
    pub properties: serde_json::Value,
}
