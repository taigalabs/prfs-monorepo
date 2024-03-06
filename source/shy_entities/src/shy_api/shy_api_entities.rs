use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{
    CreateShyTopicRequest, CreateShyTopicResponse, GetShyChannelResponse, GetShyChannelsRequest,
    GetShyChannelsResponse, GetShyPostsOfTopicRequest, GetShyPostsOfTopicResponse,
    GetShyTopicsRequest, GetShyTopicsResponse,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum ShyApiRequest {
    create_shy_topic(CreateShyTopicRequest),
    get_shy_channels(GetShyChannelsRequest),
    get_shy_topics(GetShyTopicsRequest),
    get_shy_posts_of_topic(GetShyPostsOfTopicRequest),
    get_shy_channel(GetShyChannelsRequest),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum ShyApiResponse {
    create_shy_topic(CreateShyTopicResponse),
    get_shy_channels(GetShyChannelsResponse),
    get_shy_topics(GetShyTopicsResponse),
    get_shy_posts_of_topic(GetShyPostsOfTopicResponse),
    get_shy_channel(GetShyChannelResponse),
}
