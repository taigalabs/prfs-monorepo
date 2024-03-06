use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_entities::entities::PrfsProofRecord;
use prfs_entities::prfs_api::{CreatePrfsProofRecordRequest, GetPrfsProofRecordResponse};
use shy_db_interface::shy;
use shy_entities::entities::{ShyPost, ShyTopic, ShyTopicProof};
use shy_entities::shy_api::{
    CreateShyTopicRequest, CreateShyTopicResponse, GetShyTopicRequest, GetShyTopicResponse,
    GetShyTopicsRequest, GetShyTopicsResponse,
};
use std::sync::Arc;

use crate::envs::ENVS;
use crate::error_codes::API_ERROR_CODE;

const LIMIT: i32 = 15;

pub async fn create_shy_topic(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreateShyTopicRequest>,
) -> (StatusCode, Json<ApiResponse<CreateShyTopicResponse>>) {
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
            public_key: input.author_public_key.to_string(),
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

    let shy_topic_proof = ShyTopicProof {
        shy_topic_proof_id: input.shy_topic_proof_id.to_string(),
        proof: input.proof,
        public_inputs: input.public_inputs.to_string(),
        public_key: input.author_public_key.to_string(),
        serial_no: input.serial_no,
        proof_identity_proof: input.proof_identity_input.to_string(),
    };

    let _proof_id = match shy::insert_shy_topic_proof(&mut tx, &shy_topic_proof).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(&API_ERROR_CODE.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let shy_topic = ShyTopic {
        title: input.title.to_string(),
        topic_id: input.topic_id.to_string(),
        // content: input.content.to_string(),
        channel_id: input.channel_id.to_string(),
        shy_topic_proof_id: input.shy_topic_proof_id.to_string(),
        // proof_identity_input: input.proof_identity_input.to_string(),
        num_replies: 0,
        author_public_key: input.author_public_key.to_string(),
    };

    let topic_id = match shy::insert_shy_topic(&mut tx, &shy_topic).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(&API_ERROR_CODE.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let shy_post = ShyPost {
        post_id: input.topic_id.to_string(),
        content: input.content.to_string(),
        channel_id: input.channel_id.to_string(),
        shy_topic_proof_id: input.shy_topic_proof_id.to_string(),
        topic_id: input.topic_id.to_string(),
        author_public_key: input.author_public_key.to_string(),
        author_sig: input.author_sig.to_string(),
    };

    let _post_id = match shy::insert_shy_post(&mut tx, &shy_post).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(&API_ERROR_CODE.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreateShyTopicResponse { topic_id });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_shy_topics(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyTopicsRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyTopicsResponse>>) {
    let pool = &state.db2.pool;
    let shy_topics = shy::get_shy_topics(pool, &input.channel_id, input.offset, LIMIT)
        .await
        .unwrap();

    let next_offset = if shy_topics.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetShyTopicsResponse {
        shy_topics,
        next_offset,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_shy_topic(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyTopicRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyTopicResponse>>) {
    let pool = &state.db2.pool;
    let shy_topic = shy::get_shy_topic(pool, &input.topic_id).await.unwrap();

    let resp = ApiResponse::new_success(GetShyTopicResponse { shy_topic });
    return (StatusCode::OK, Json(resp));
}
