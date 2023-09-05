use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::PrfsPolicyItem;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsAccount {
    pub sig: String,
    pub avatar_color: String,

    #[ts(type = "string[]")]
    pub policy_ids: sqlx::types::Json<Vec<String>>,
}
