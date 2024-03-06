use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum ShyTopicProofAction {
    create_shy_topic(CreateShyTopicAction),
    create_shy_topic_reply(CreateShyTopicReplyAction),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyTopicAction {
    pub topic_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyTopicReplyAction {
    pub reply_id: String,
}
