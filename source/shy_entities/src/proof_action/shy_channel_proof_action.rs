use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum ShyChannelProofAction {
    enter_shy_channel(EnterShyChannelAction),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct EnterShyChannelAction {
    pub channel_id: String,
    pub nonce: u32,
}
