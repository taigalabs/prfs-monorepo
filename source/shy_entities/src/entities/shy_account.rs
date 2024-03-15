use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyAccount {
    pub account_id: String,
    pub public_key: String,
    pub avatar_color: String,

    #[ts(type = "string[]")]
    pub policy_ids: sqlx::types::Json<Vec<String>>,
}
