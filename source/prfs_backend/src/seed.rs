use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct SeedJson {
    pub assets_json_path: String,
}
