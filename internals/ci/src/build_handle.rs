use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct BuildHandle {
    pub timestamp: String,
}
