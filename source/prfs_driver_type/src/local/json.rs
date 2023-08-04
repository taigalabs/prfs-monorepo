use crate::drivers::circuit_driver::CircuitDriver;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DriversJson {
    pub drivers: Vec<CircuitDriver>,
}
