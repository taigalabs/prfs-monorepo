use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export)]
pub struct PrfsProofSnapItem {
    pub proof_label: String,
    pub proof_short_url: String,
}
