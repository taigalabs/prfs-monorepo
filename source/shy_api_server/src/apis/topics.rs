use prfs_api_rs::api::create_prfs_proof_record;
use prfs_axum_lib::axum::extract::State;
use prfs_axum_lib::axum::http::StatusCode;
use prfs_axum_lib::axum::Json;
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_crypto::ethers_core::utils::keccak256;
use prfs_crypto::hex;
use prfs_web3_rs::signature::verify_eth_sig_by_pk;
use shy_api_error_codes::SHY_API_ERROR_CODES;
use shy_db_interface::shy;
use shy_entities::{CreateShyTopicAction, ShyTopicProofAction, ShyTopicWithProofs};
use shy_entities::{
    CreateShyTopicRequest, CreateShyTopicResponse, GetShyTopicRequest, GetShyTopicResponse,
    GetShyTopicsRequest, GetShyTopicsResponse,
};
use shy_entities::{ShyProof, ShyTopic};
use std::sync::Arc;

use crate::envs::ENVS;

const LIMIT: i32 = 15;

pub async fn create_shy_topic(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreateShyTopicRequest>,
) -> (StatusCode, Json<ApiResponse<CreateShyTopicResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &SHY_API_ERROR_CODES.UNKNOWN_ERROR);

    let title_hash = {
        let k = keccak256(input.title.as_bytes());
        format!("0x{}", hex::encode(k))
    };

    let content_hash = {
        let k = keccak256(input.content.as_bytes());
        format!("0x{}", hex::encode(k))
    };

    let action = ShyTopicProofAction::create_shy_topic(CreateShyTopicAction {
        topic_id: input.topic_id.to_string(),
        channel_id: input.channel_id.to_string(),
        title_hash,
        content_hash,
    });

    let msg = serde_json::to_vec(&action).unwrap();

    let mut author_proof_ids: Vec<String> = vec![];
    for proof in input.proofs {
        if let Err(err) = verify_eth_sig_by_pk(&proof.author_sig, &msg, &proof.author_public_key) {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.INVALID_SIG,
                format!("sig: {}, err: {}", proof.author_sig, err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }

        let _proof_record_resp = match create_prfs_proof_record(
            &ENVS.prfs_api_server_endpoint,
            &proof.proof,
            &proof.author_public_key,
        )
        .await
        {
            Ok(r) => r,
            Err(err) => {
                let resp =
                    ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };

        let shy_proof = ShyProof {
            shy_proof_id: proof.shy_proof_id.to_string(),
            proof: proof.proof,
            public_inputs: proof.public_inputs.to_string(),
            public_key: proof.author_public_key.to_string(),
            serial_no: proof.serial_no,
            proof_identity_input: proof.proof_identity_input.to_string(),
            proof_type_id: proof.proof_type_id.to_string(),
            proof_idx: proof.proof_idx,
        };

        match shy::insert_shy_proof(&mut tx, &shy_proof).await {
            Ok(i) => i,
            Err(err) => {
                let resp = ApiResponse::new_error(
                    &SHY_API_ERROR_CODES.RECORD_INSERT_FAIL,
                    err.to_string(),
                );
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };

        // other_proof_ids.push(proof.shy_proof_id);
        // author_proof_identity.push(other_proof.proof_identity_input);
        author_proof_ids.push(proof.shy_proof_id.to_string());
    }

    let shy_topic = ShyTopic {
        title: input.title.to_string(),
        topic_id: input.topic_id.to_string(),
        channel_id: input.channel_id.to_string(),
        total_reply_count: 0,
        content: input.content.to_string(),
        author_public_key: input.author_public_key.to_string(),
        author_proof_ids: author_proof_ids.clone(),
        author_sig: input.author_sig.to_string(),
        participant_proof_ids: author_proof_ids.clone(),
        sub_channel_id: input.sub_channel_id.to_string(),
        total_like_count: 0,
    };

    let topic_id = match shy::insert_shy_topic(&mut tx, &shy_topic).await {
        Ok(i) => i,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&SHY_API_ERROR_CODES.RECORD_INSERT_FAIL, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    bail_out_tx_commit!(tx, &SHY_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(CreateShyTopicResponse { topic_id });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_shy_topics(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyTopicsRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyTopicsResponse>>) {
    let pool = &state.db2.pool;
    let shy_topics = match shy::get_shy_topics(pool, &input.channel_id, input.offset, LIMIT).await {
        Ok(r) => r,
        Err(err) => {
            let resp = ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let mut shy_topics_with_proofs: Vec<ShyTopicWithProofs> = vec![];
    for topic in &shy_topics {
        let shy_proofs =
            match shy::get_shy_proofs_by_proof_ids(pool, &topic.inner.author_proof_ids).await {
                Ok(p) => p,
                Err(err) => {
                    let resp =
                        ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
                    return (StatusCode::BAD_REQUEST, Json(resp));
                }
            };

        shy_topics_with_proofs.push(ShyTopicWithProofs {
            shy_topic: topic.clone(),
            shy_proofs,
        });
    }

    let next_offset = if shy_topics.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetShyTopicsResponse {
        shy_topics_with_proofs,
        next_offset,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_shy_topic(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyTopicRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyTopicResponse>>) {
    let pool = &state.db2.pool;
    let shy_topic = match shy::get_shy_topic(pool, &input.topic_id).await {
        Ok(t) => t,
        Err(err) => {
            let resp = ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let shy_proofs = match shy::get_shy_proofs_by_proof_ids(pool, &shy_topic.inner.author_proof_ids)
        .await
    {
        Ok(p) => p,
        Err(err) => {
            let resp = ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let shy_topic_with_proofs = ShyTopicWithProofs {
        shy_topic,
        shy_proofs,
    };

    let resp = ApiResponse::new_success(GetShyTopicResponse {
        shy_topic_with_proofs,
    });
    return (StatusCode::OK, Json(resp));
}
