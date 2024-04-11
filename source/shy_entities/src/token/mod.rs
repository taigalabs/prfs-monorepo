use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct EnterShyChannelToken {
    shy_proof_id: String,
    sig: String,
    sig_msg: Vec<u8>,
}
