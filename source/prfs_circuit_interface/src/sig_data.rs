use serde::{Deserialize, Serialize};
use sqlx::Type;
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct SigData {
    msgRaw: String,
    msgHash: String,
    sig: String,
}
