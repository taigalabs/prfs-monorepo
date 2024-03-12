use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_entities::entities::PrfsProofRecord;
use prfs_entities::prfs_api::{CreatePrfsProofRecordRequest, GetPrfsProofRecordResponse};
use shy_api_error_codes::SHY_API_ERROR_CODES;
use shy_db_interface::shy;
use shy_entities::entities::{ShyPost, ShyTopic, ShyTopicProof};
use shy_entities::shy_api::{
    CreateShyTopicRequest, CreateShyTopicResponse, GetShyPostsOfTopicRequest,
    GetShyPostsOfTopicResponse, GetShyTopicProofRequest, GetShyTopicProofResponse,
    GetShyTopicRequest, GetShyTopicResponse, GetShyTopicsRequest, GetShyTopicsResponse,
};
use std::sync::Arc;

use crate::envs::ENVS;

const LIMIT: i32 = 15;

pub async fn get_shy_topic_proof(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyTopicProofRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyTopicProofResponse>>) {
    let pool = &state.db2.pool;
    let shy_topic_proof = match shy::get_shy_topic_proof(pool, &input.public_key).await {
        Ok(t) => t,
        Err(err) => {
            let resp = ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetShyTopicProofResponse { shy_topic_proof });
    return (StatusCode::OK, Json(resp));
}
