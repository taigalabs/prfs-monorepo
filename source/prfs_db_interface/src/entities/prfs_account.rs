use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PrfsAccount {
    pub sig: String,
}

impl PrfsAccount {
    pub fn table_name() -> &'static str {
        "prfs_accounts"
    }
}
