use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::ShyChannel;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyChannelsRequest {
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyChannelsResponse {
    pub rows: Vec<ShyChannel>,
    pub next_offset: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyChannelRequest {
    pub channel_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyChannelResponse {
    pub shy_channel: Option<ShyChannel>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct JoinShyChannelRequest {
    pub nonce: u32,
    pub channel_id: String,
    pub shy_proof_id: String,
    pub author_public_key: String,
    pub author_sig: String,
    pub author_sig_msg: Vec<u8>,
    pub proof_identity_input: String,
    pub proof: Vec<u8>,
    pub public_inputs: String,
    pub serial_no: String,
    pub proof_type_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct JoinShyChannelResponse {
    pub shy_proof_id: String,
}
