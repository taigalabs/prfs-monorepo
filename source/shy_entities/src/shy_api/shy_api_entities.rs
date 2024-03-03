use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{
    CreateShyPostRequest, CreateShyPostResponse, GetShyChannelResponse, GetShyChannelsRequest,
    GetShyChannelsResponse, GetShyPostRequest, GetShyPostResponse, GetShyPostsRequest,
    GetShyPostsResponse,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum ShyApiRequest {
    create_shy_post(CreateShyPostRequest),
    get_shy_channels(GetShyChannelsRequest),
    get_shy_posts(GetShyPostsRequest),
    get_shy_post(GetShyPostRequest),
    get_shy_channel(GetShyChannelsRequest),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum ShyApiResponse {
    create_shy_post(CreateShyPostResponse),
    get_shy_channels(GetShyChannelsResponse),
    get_shy_posts(GetShyPostsResponse),
    get_shy_post(GetShyPostResponse),
    get_shy_channel(GetShyChannelResponse),
}
