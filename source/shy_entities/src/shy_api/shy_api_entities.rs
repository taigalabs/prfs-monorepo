use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{
    CreateShyPostRequest, CreateShyPostResponse, CreateShyPostWithProofRequest,
    CreateShyTopicRequest, CreateShyTopicResponse, GetShyChannelResponse, GetShyChannelsRequest,
    GetShyChannelsResponse, GetShyPostsOfTopicRequest, GetShyPostsOfTopicResponse,
    GetShyTopicProofRequest, GetShyTopicProofResponse, GetShyTopicRequest, GetShyTopicResponse,
    GetShyTopicsRequest, GetShyTopicsResponse, SignInShyAccountRequest, SignInShyAccountResponse,
    SignUpShyAccountRequest, SignUpShyAccountResponse,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum ShyApiRequest {
    create_shy_topic(CreateShyTopicRequest),
    create_shy_post(CreateShyPostRequest),
    create_shy_post_with_proof(CreateShyPostWithProofRequest),
    sign_up_shy_account(SignUpShyAccountRequest),
    sign_in_shy_account(SignInShyAccountRequest),
    get_shy_channels(GetShyChannelsRequest),
    get_shy_channel(GetShyChannelsRequest),
    get_shy_topics(GetShyTopicsRequest),
    get_shy_topic(GetShyTopicRequest),
    get_shy_topic_proof(GetShyTopicProofRequest),
    get_shy_posts_of_topic(GetShyPostsOfTopicRequest),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum ShyApiResponse {
    create_shy_topic(CreateShyTopicResponse),
    create_shy_post(CreateShyPostResponse),
    create_shy_post_with_proof(CreateShyPostResponse),
    sign_up_shy_account(SignUpShyAccountResponse),
    sign_in_shy_account(SignInShyAccountResponse),
    get_shy_channels(GetShyChannelsResponse),
    get_shy_channel(GetShyChannelResponse),
    get_shy_topics(GetShyTopicsResponse),
    get_shy_topic(GetShyTopicResponse),
    get_shy_topic_proof(GetShyTopicProofResponse),
    get_shy_posts_of_topic(GetShyPostsOfTopicResponse),
}
