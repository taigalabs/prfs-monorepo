use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum ShyCommentProofAction {
    create_shy_comment(CreateShyCommentAction),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyCommentAction {
    pub topic_id: String,
    pub comment_id: String,
    pub content: String,
}
