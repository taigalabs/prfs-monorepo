use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::prfs_atst_status::PrfsAtstStatus;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsAccAtst {
    pub acc_atst_id: String,
    pub atst_type: String,
    pub dest: String,
    pub account_id: String,
    pub cm: String,
    pub username: String,
    pub avatar_url: String,
    pub document_url: String,
    pub status: PrfsAtstStatus,
}
