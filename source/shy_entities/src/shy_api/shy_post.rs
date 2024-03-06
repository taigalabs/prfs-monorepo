use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::{DateTimed, ShyTopic, ShyTopicPost};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyPostsOfTopicRequest {
    pub topic_id: String,
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyPostsOfTopicResponse {
    pub shy_topic: DateTimed<ShyTopic>,
}
