use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_crypto::signature::verify_eth_sig;
use prfs_entities::entities::PrfsProofRecord;
use prfs_entities::prfs_api::{CreatePrfsProofRecordRequest, GetPrfsProofRecordResponse};
use shy_db_interface::shy;
use shy_entities::entities::{ShyPost, ShyTopic, ShyTopicProof};
use shy_entities::proof_action::{CreateShyTopicAction, ShyTopicProofAction};
use shy_entities::shy_api::{
    CreateShyTopicRequest, CreateShyTopicResponse, GetShyPostsOfTopicRequest,
    GetShyPostsOfTopicResponse, GetShyTopicRequest, GetShyTopicResponse, GetShyTopicsRequest,
    GetShyTopicsResponse,
};
use std::sync::Arc;

use crate::envs::ENVS;
use crate::error_codes::API_ERROR_CODE;

const LIMIT: i32 = 15;

#[test]
fn test_123() {
    let str = r#"{"power": "su pe r"}"#;
    println!("str: {}", str);

    let str_b = str.as_bytes();
    println!("str_b: {:?}", str_b);

    let str_str = serde_json::to_string(str).unwrap();
    println!("str_str: {:?}", str_str);

    let str_b2 = serde_json::to_vec(str).unwrap();
    println!("str_b2: {:?}", str_b2);

    let action = ShyTopicProofAction::create_shy_topic(CreateShyTopicAction {
        topic_id: "power 11".to_string(),
        channel_id: " pork 1".to_string(),
        content: " af foo ".to_string(),
    });

    let action_str = serde_json::to_string(&action).unwrap();
    println!("action_str: {:?}", action_str);

    let action_b = serde_json::to_vec(&action).unwrap();
    println!("action_b1: {:?}", action_b);

    let action_b2 = action_str.as_bytes();
    println!("action_b2: {:?}", action_b2);
}

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

    let action = ShyTopicProofAction::create_shy_topic(CreateShyTopicAction {
        topic_id: input.topic_id.to_string(),
        channel_id: input.channel_id.to_string(),
        content: input.content.to_string(),
    });

    let msg = serde_json::to_vec(&action).unwrap();
    let msg2 = serde_json::to_string(&action).unwrap();

    println!(
        "msg2: {}, msg22: {}, eq: {}",
        msg2,
        input.author_sig_msg2,
        msg2 == input.author_sig_msg2
    );

    for (idx, c) in msg.iter().enumerate() {
        if *c != input.author_sig_msg[idx] {
            println!(
                "444, idx: {}, c_ours: {}, c_input: {}",
                idx, c, input.author_sig_msg[idx]
            );
        }
    }

    if msg != input.author_sig_msg {
        let resp = ApiResponse::new_error(
            &API_ERROR_CODE.NOT_MACHING_SIG_MSG,
            format!("msg: {:?}, author_sig_msg: {:?}", msg, input.author_sig_msg),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    if let Err(err) = verify_eth_sig(&input.author_sig, &msg, &input.author_public_key) {
        let resp = ApiResponse::new_error(
            &API_ERROR_CODE.INVALID_SIG,
            format!("sig: {}, err: {}", input.author_sig, err),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

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
        proof_identity_input: input.proof_identity_input.to_string(),
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
        channel_id: input.channel_id.to_string(),
        num_replies: 0,
        content: input.content.to_string(),
        shy_topic_proof_id: input.shy_topic_proof_id.to_string(),
        author_public_key: input.author_public_key.to_string(),
        author_sig: input.author_sig.to_string(),
        participant_identity_inputs: vec![input.proof_identity_input.to_string()],
    };

    let topic_id = match shy::insert_shy_topic(&mut tx, &shy_topic).await {
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
    let rows = match shy::get_shy_topic_syn1s(pool, &input.channel_id, input.offset, LIMIT).await {
        Ok(r) => r,
        Err(err) => {
            let resp = ApiResponse::new_error(&API_ERROR_CODE.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetShyTopicsResponse {
        shy_topic_syn1s: rows,
        next_offset,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_shy_topic(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyTopicRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyTopicResponse>>) {
    let pool = &state.db2.pool;
    let shy_topic_syn1 = match shy::get_shy_topic_syn1(pool, &input.topic_id).await {
        Ok(t) => t,
        Err(err) => {
            let resp = ApiResponse::new_error(&API_ERROR_CODE.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetShyTopicResponse { shy_topic_syn1 });
    return (StatusCode::OK, Json(resp));
}
