use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};
use ts_rs::TS;

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
    pub status: PrfsAccAtstStatus,
}

#[derive(TS, Clone, Debug, Serialize, Deserialize, sqlx::Type, EnumString, Display)]
#[ts(export)]
#[sqlx(type_name = "VARCHAR")]
pub enum PrfsAccAtstStatus {
    Valid,
    Invalid,
}
