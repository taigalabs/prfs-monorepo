use prfs_axum_lib::axum::{body::Body, extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_entities::entities::PrfsProofRecord;
use prfs_entities::prfs_api::{
    CreatePrfsProofRecordRequest, GetPrfsProofRecordRequest, GetPrfsProofRecordResponse,
};
use shy_db_interface::shy;
use shy_entities::entities::ShyPost;
use shy_entities::shy_api::{GetShyPostRequest, GetShyPostResponse};
use shy_entities::{
    entities::ShyPostProof,
    shy_api::{
        CreateShyPostRequest, CreateShyPostResponse, GetShyPostsRequest, GetShyPostsResponse,
    },
};
use std::sync::Arc;

use crate::envs::ENVS;
use crate::error_codes::API_ERROR_CODE;

const LIMIT: i32 = 15;

pub async fn create_shy_post(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreateShyPostRequest>,
) -> (StatusCode, Json<ApiResponse<CreateShyPostResponse>>) {
    let state = state.clone();
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let cli = &state.client;
    let url = format!(
        "{}/api/v0/create_prfs_proof_record",
        &ENVS.prfs_api_server_endpoint
    );
    let data = CreatePrfsProofRecordRequest {
        proof_record: PrfsProofRecord {
            public_key: input.public_key.to_string(),
            proof_starts_with: input.proof[0..10].to_vec(),
        },
    };
    let res = match cli.post(url).json(&data).send().await {
        Ok(res) => res,
        Err(err) => {
            let resp = ApiResponse::new_error(&API_ERROR_CODE.BAD_URL, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let _res: ApiResponse<GetPrfsProofRecordResponse> = match res.json().await {
        Ok(r) => r,
        Err(err) => {
            let resp = ApiResponse::new_error(&API_ERROR_CODE.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let shy_post_proof = ShyPostProof {
        shy_post_proof_id: input.shy_post_proof_id.to_string(),
        proof: input.proof,
        public_inputs: input.public_inputs.to_string(),
        public_key: input.public_key.to_string(),
        serial_no: input.serial_no,
    };

    let _proof_id = match shy::insert_shy_post_proof(&mut tx, &shy_post_proof).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(&API_ERROR_CODE.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let shy_post = ShyPost {
        title: input.title.to_string(),
        post_id: input.post_id.to_string(),
        content: input.content.to_string(),
        channel_id: input.channel_id.to_string(),
        shy_post_proof_id: input.shy_post_proof_id.to_string(),
        proof_identity_input: input.proof_identity_input.to_string(),
        num_replies: 0,
        public_key: input.public_key.to_string(),
    };

    let post_id = match shy::insert_shy_post(&mut tx, &shy_post).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(&API_ERROR_CODE.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreateShyPostResponse { post_id });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_shy_posts(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyPostsRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyPostsResponse>>) {
    let pool = &state.db2.pool;
    let shy_posts = shy::get_shy_posts(pool, &input.channel_id, input.offset, LIMIT)
        .await
        .unwrap();

    let next_offset = if shy_posts.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetShyPostsResponse {
        shy_posts,
        next_offset,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_shy_post(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyPostRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyPostResponse>>) {
    let pool = &state.db2.pool;
    let shy_post = shy::get_shy_post(pool, &input.post_id).await.unwrap();

    let resp = ApiResponse::new_success(GetShyPostResponse { shy_post });
    return (StatusCode::OK, Json(resp));
}
