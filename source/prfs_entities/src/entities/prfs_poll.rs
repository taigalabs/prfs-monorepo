use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsPoll {
    #[ts(type = "string")]
    pub proof_instance_id: Uuid,

    pub label: String,
}
