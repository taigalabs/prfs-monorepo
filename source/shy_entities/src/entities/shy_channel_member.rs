use serde::{Deserialize, Serialize};
use sqlx::Type;
use strum_macros::{Display, EnumString};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyChannelMember {
    pub serial_no: String,
    pub channel_id: String,
    pub shy_proof_id: String,
    pub public_key: String,
}
