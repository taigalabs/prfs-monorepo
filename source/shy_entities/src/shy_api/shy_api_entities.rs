use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::JoinShyChannelResponse;

use super::{
    CreateShyCommentRequest, CreateShyCommentResponse, CreateShyCommentWithProofsRequest,
    CreateShyTopicRequest, CreateShyTopicResponse, GetShyChannelResponse, GetShyChannelsRequest,
    GetShyChannelsResponse, GetShyCommentsOfTopicRequest, GetShyCommentsOfTopicResponse,
    GetShyProofsRequest, GetShyProofsResponse, GetShyTopicRequest, GetShyTopicResponse,
    GetShyTopicsRequest, GetShyTopicsResponse, JoinShyChannelRequest, SignInShyAccountRequest,
    SignInShyAccountResponse, SignUpShyAccountRequest, SignUpShyAccountResponse,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum ShyApiRequest {
    create_shy_topic(CreateShyTopicRequest),
    create_shy_comment(CreateShyCommentRequest),
    create_shy_comment_with_proofs(CreateShyCommentWithProofsRequest),
    sign_up_shy_account(SignUpShyAccountRequest),
    sign_in_shy_account(SignInShyAccountRequest),
    get_shy_channels(GetShyChannelsRequest),
    get_shy_channel(GetShyChannelsRequest),
    get_shy_topics(GetShyTopicsRequest),
    get_shy_topic(GetShyTopicRequest),
    get_shy_proofs(GetShyProofsRequest),
    get_shy_comments_of_topic(GetShyCommentsOfTopicRequest),
    join_shy_channel(JoinShyChannelRequest),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum ShyApiResponse {
    create_shy_topic(CreateShyTopicResponse),
    create_shy_comment(CreateShyCommentResponse),
    create_shy_comment_with_proofs(CreateShyCommentResponse),
    sign_up_shy_account(SignUpShyAccountResponse),
    sign_in_shy_account(SignInShyAccountResponse),
    get_shy_channels(GetShyChannelsResponse),
    get_shy_channel(GetShyChannelResponse),
    get_shy_topics(GetShyTopicsResponse),
    get_shy_topic(GetShyTopicResponse),
    get_shy_proofs(GetShyProofsResponse),
    get_shy_comments_of_topic(GetShyCommentsOfTopicResponse),
    join_shy_channel(JoinShyChannelResponse),
}
