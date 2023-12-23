use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsAccAtst {
    #[ts(type = "string")]
    pub acc_atst_id: Uuid,
    pub atst_type: String,
    pub dest: String,
    pub account_id: String,
    pub cm: String,
    pub username: String,
    pub avatar_url: String,
    pub document_url: String,
}
