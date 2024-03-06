use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SetElementRecord {
    pub val: String,
    pub meta: String,
}
