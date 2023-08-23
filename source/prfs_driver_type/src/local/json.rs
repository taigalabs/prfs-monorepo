use prfs_entities::entities::CircuitDriver;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DriversJson2 {
    pub drivers: Vec<CircuitDriver>,
}
