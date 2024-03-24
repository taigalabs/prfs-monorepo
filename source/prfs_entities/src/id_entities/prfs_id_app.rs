use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsIdApp {
    pub app_id: String,
    pub label: String,
    pub img_url: String,
}
