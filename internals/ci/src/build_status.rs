use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct BuildStatus {
    pub timestamp: String,
}
