use prfs_entities::entities::PrfsCircuitDriver;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DriversJson2 {
    pub drivers: Vec<PrfsCircuitDriver>,
}
