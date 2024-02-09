use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct TwitterAccValidation {
    pub atst_type: String,
    pub dest: String,
    pub account_id: String,
    pub cm: String,
    pub username: String,
    pub avatar_url: String,
    pub document_url: String,
}
