use prfs_entities::entities::CircuitType;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitTypesJson {
    pub circuit_types: Vec<CircuitType>,
}
