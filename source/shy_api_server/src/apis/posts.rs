use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_entities::entities::PrfsProofRecord;
use prfs_entities::prfs_api::{CreatePrfsProofRecordRequest, GetPrfsProofRecordResponse};
use shy_db_interface::shy;
use shy_entities::entities::{ShyPost, ShyTopic, ShyTopicProof};
use shy_entities::shy_api::{
    CreateShyPostRequest, CreateShyPostResponse, CreateShyTopicRequest, CreateShyTopicResponse,
    GetShyPostsOfTopicRequest, GetShyPostsOfTopicResponse, GetShyTopicRequest, GetShyTopicResponse,
    GetShyTopicsRequest, GetShyTopicsResponse,
};
use std::sync::Arc;

use crate::envs::ENVS;
use crate::error_codes::API_ERROR_CODE;

const LIMIT: i32 = 15;

pub async fn get_shy_posts_of_topic(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyPostsOfTopicRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyPostsOfTopicResponse>>) {
    let pool = &state.db2.pool;

    // let shy_topic = shy::get_shy_posts_of_topic(pool, &input.topic_id, input.offset, LIMIT)
    //     .await
    //     .unwrap();

    panic!();
    // let resp = ApiResponse::new_success(GetShyPostsOfTopicResponse { shy_topic });
    // return (StatusCode::OK, Json(resp));
}

pub async fn create_shy_post(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreateShyPostRequest>,
) -> (StatusCode, Json<ApiResponse<CreateShyPostResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    println!("power: {:?}", input);

    let shy_post = ShyPost {
        post_id: input.post_id,
        topic_id: input.topic_id,
        content: input.content,
        channel_id: input.channel_id,
        shy_topic_proof_id: input.shy_topic_proof_id,
        author_public_key: input.author_public_key,
        author_sig: input.author_sig,
    };

    let post_id = shy::insert_shy_post(&mut tx, &shy_post).await.unwrap();
    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreateShyPostResponse { post_id });
    return (StatusCode::OK, Json(resp));
}
