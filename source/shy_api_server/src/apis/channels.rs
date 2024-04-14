use prfs_api_rs::api::create_prfs_proof_record;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_entities::{CreatePrfsProofRecordRequest, PrfsProofRecord};
use prfs_web3_rs::signature::verify_eth_sig_by_pk;
use shy_api_error_codes::SHY_API_ERROR_CODES;
use shy_db_interface::shy;
use shy_entities::{
    EnterShyChannelAction, GetShyChannelRequest, GetShyChannelResponse, GetShyChannelsRequest,
    GetShyChannelsResponse, JoinShyChannelRequest, JoinShyChannelResponse, ShyChannelMember,
    ShyChannelProofAction, ShyProof,
};
use std::sync::Arc;

use crate::envs::ENVS;

const LIMIT: i32 = 15;

pub async fn get_shy_channels(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyChannelsRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyChannelsResponse>>) {
    let pool = &state.db2.pool;
    let rows = match shy::get_shy_channels(pool, input.offset, LIMIT).await {
        Ok(r) => r,
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

    let resp = ApiResponse::new_success(GetShyChannelsResponse { rows, next_offset });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_shy_channel(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyChannelRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyChannelResponse>>) {
    let pool = &state.db2.pool;
    let shy_channel = match shy::get_shy_channel(pool, &input.channel_id).await {
        Ok(c) => c,
        Err(err) => {
            let resp = ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };
    println!("asdf: {:?}", shy_channel);

    let resp = ApiResponse::new_success(GetShyChannelResponse { shy_channel });
    return (StatusCode::OK, Json(resp));
}

pub async fn join_shy_channel(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<JoinShyChannelRequest>,
) -> (StatusCode, Json<ApiResponse<JoinShyChannelResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &SHY_API_ERROR_CODES.UNKNOWN_ERROR);

    let action = ShyChannelProofAction::enter_shy_channel(EnterShyChannelAction {
        channel_id: input.channel_id.to_string(),
        nonce: input.nonce,
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
        serial_no: input.serial_no.to_string(),
        proof_identity_input: input.proof_identity_input.to_string(),
        proof_type_id: input.proof_type_id,
    };

    let _proof_id = match shy::insert_shy_proof(&mut tx, &shy_proof).await {
        Ok(i) => i,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&SHY_API_ERROR_CODES.RECORD_INSERT_FAIL, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    // let shy_post = ShyPost {
    //     post_id: input.post_id,
    //     topic_id: input.topic_id,
    //     content: input.content,
    //     channel_id: input.channel_id,
    //     shy_proof_id: input.shy_proof_id,
    //     author_public_key: input.author_public_key,
    //     author_sig: input.author_sig.to_string(),
    // };

    let shy_channel_member = ShyChannelMember {
        serial_no: input.serial_no.to_string(),
        channel_id: input.channel_id.to_string(),
        shy_proof_id: input.shy_proof_id.to_string(),
        public_key: input.author_public_key.to_string(),
    };

    match shy::upsert_shy_channel_member(&mut tx, &shy_channel_member).await {
        Ok(_) => (),
        Err(err) => {
            let resp = ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    bail_out_tx_commit!(tx, &SHY_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(JoinShyChannelResponse {
        shy_proof_id: input.shy_proof_id,
    });
    return (StatusCode::OK, Json(resp));
}
