use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SetElementRecord {
    pub val: String,
    pub meta: String,
}
