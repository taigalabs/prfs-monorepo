use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsPoll {
    #[ts(type = "string")]
    pub ballot_id: Uuid,

    pub label: String,
    pub plural_voting: bool,
    pub proof_type_id: String,
    pub author: String,
}
