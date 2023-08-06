use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize)]
#[ts(export)]
pub struct PrfsAccount {
    pub sig: String,
}

impl PrfsAccount {
    pub fn table_name() -> &'static str {
        "prfs_accounts"
    }
}
