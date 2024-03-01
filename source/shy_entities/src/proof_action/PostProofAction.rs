use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PostProofAction {
    create_shy_post(CreateShyPostAction),
    create_shy_post_reply(CreateShyPostReplyAction),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyPostAction {
    pub post_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyPostReplyAction {
    pub reply_id: String,
}
