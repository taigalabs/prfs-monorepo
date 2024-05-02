use prfs_api_rs::api::create_prfs_proof_record;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_web3_rs::signature::verify_eth_sig_by_pk;
use shy_api_error_codes::SHY_API_ERROR_CODES;
use shy_db_interface::shy;
use shy_entities::{CreateShyPostAction, ShyPostProofAction};
use shy_entities::{
    CreateShyPostRequest, CreateShyPostResponse, CreateShyPostWithProofRequest,
    GetShyPostsOfTopicRequest, GetShyPostsOfTopicResponse,
};
use shy_entities::{ShyPost, ShyProof};
use std::sync::Arc;

use crate::envs::ENVS;

const LIMIT: i32 = 15;

pub async fn get_shy_posts_of_topic(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyPostsOfTopicRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyPostsOfTopicResponse>>) {
    let pool = &state.db2.pool;

    let rows = match shy::get_shy_posts_syn1_of_topic(&pool, &input.topic_id, input.offset, LIMIT)
        .await
    {
        Ok(p) => p,
        Err(err) => {
            let resp = ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetShyPostsOfTopicResponse { rows, next_offset });
    return (StatusCode::OK, Json(resp));
}

pub async fn create_shy_post(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreateShyPostRequest>,
) -> (StatusCode, Json<ApiResponse<CreateShyPostResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let shy_proofs = match shy::get_shy_proofs(&pool, &input.author_public_key).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.SHY_PROOF_RETRIEVAL_FAIL,
                err.to_string(),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    if shy_proofs.len() < 1 {
        let resp = ApiResponse::new_error(
            &SHY_API_ERROR_CODES.SHY_PROOF_RETRIEVAL_FAIL,
            format!(
                "Proof not found, author_pub_key: {}",
                input.author_public_key
            ),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    let mut topic = match shy::get_shy_topic__tx(&mut tx, &input.topic_id).await {
        Ok(t) => t,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.SHY_PROOF_RETRIEVAL_FAIL,
                err.to_string(),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };
    topic.inner.total_reply_count += 1;

    let action = ShyPostProofAction::create_shy_post(CreateShyPostAction {
        topic_id: input.topic_id.to_string(),
        post_id: input.post_id.to_string(),
        content: input.content.to_string(),
    });

    let msg = serde_json::to_vec(&action).unwrap();
    if msg != input.author_sig_msg {
        let resp = ApiResponse::new_error(
            &SHY_API_ERROR_CODES.NOT_MACHING_SIG_MSG,
            format!("msg: {:?}", input.author_sig_msg),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    if let Err(err) = verify_eth_sig_by_pk(&input.author_sig, &msg, &input.author_public_key) {
        let resp = ApiResponse::new_error(
            &SHY_API_ERROR_CODES.INVALID_SIG,
            format!("sig: {}, err: {}", input.author_sig, err),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    let author_proof_identity_inputs: Vec<String> = shy_proofs
        .iter()
        .map(|p| p.proof_identity_input.to_string())
        .collect();

    let shy_post = ShyPost {
        post_id: input.post_id,
        topic_id: input.topic_id,
        content: input.content,
        channel_id: input.channel_id,
        shy_proof_id: input.shy_proof_id,
        author_public_key: input.author_public_key,
        author_sig: input.author_sig,
        author_proof_identity_inputs: JsonType::from(author_proof_identity_inputs),
    };

    let post_id = match shy::insert_shy_post(&mut tx, &shy_post).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Can't insert shy post, err: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    match shy::insert_shy_topic(&mut tx, &topic.inner).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Can't insert shy post, err: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreateShyPostResponse { post_id });
    return (StatusCode::OK, Json(resp));
}

pub async fn create_shy_post_with_proof(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreateShyPostWithProofRequest>,
) -> (StatusCode, Json<ApiResponse<CreateShyPostResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let action = ShyPostProofAction::create_shy_post(CreateShyPostAction {
        topic_id: input.topic_id.to_string(),
        post_id: input.post_id.to_string(),
        content: input.content.to_string(),
    });

    let msg = serde_json::to_vec(&action).unwrap();
    if msg != input.author_sig_msg {
        let resp = ApiResponse::new_error(
            &SHY_API_ERROR_CODES.NOT_MACHING_SIG_MSG,
            format!("msg: {:?}", input.author_sig_msg),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    if let Err(err) = verify_eth_sig_by_pk(&input.author_sig, &msg, &input.author_public_key) {
        let resp = ApiResponse::new_error(
            &SHY_API_ERROR_CODES.INVALID_SIG,
            format!("sig: {}, err: {}", input.author_sig, err),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    let _proof_record_resp = match create_prfs_proof_record(
        &ENVS.prfs_api_server_endpoint,
        &input.proof,
        &input.author_public_key,
    )
    .await
    {
        Ok(r) => r,
        Err(err) => {
            let resp = ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let shy_proof = ShyProof {
        shy_proof_id: input.shy_proof_id.to_string(),
        proof: input.proof,
        public_inputs: input.public_inputs.to_string(),
        public_key: input.author_public_key.to_string(),
        serial_no: input.serial_no,
        proof_identity_input: input.proof_identity_input.to_string(),
        proof_type_id: input.proof_type_id,
        proof_idx: input.proof_idx,
    };

    let _proof_id = match shy::insert_shy_proof(&mut tx, &shy_proof).await {
        Ok(i) => i,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&SHY_API_ERROR_CODES.RECORD_INSERT_FAIL, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let shy_post = ShyPost {
        post_id: input.post_id,
        topic_id: input.topic_id,
        content: input.content,
        channel_id: input.channel_id,
        shy_proof_id: input.shy_proof_id,
        author_public_key: input.author_public_key,
        author_sig: input.author_sig.to_string(),
        author_proof_identity_inputs: JsonType::from(vec![input.proof_identity_input.to_string()]),
    };

    let post_id = match shy::insert_shy_post(&mut tx, &shy_post).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Can't insert shy post, err: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreateShyPostResponse { post_id });
    return (StatusCode::OK, Json(resp));
}
