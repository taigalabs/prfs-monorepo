use prfs_entities::entities::CircuitDriver;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DriversJson {
    pub drivers: Vec<CircuitDriver>,
}
