use ethers_signers::Signer;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::entities::PrfsProofInstance;
use prfs_entities::prfs_api::{
    CreatePrfsPollRequest, CreatePrfsPollResponse, GetPrfsPollByPollIdRequest,
    GetPrfsPollByPollIdResponse, GetPrfsPollResultByPollIdRequest,
    GetPrfsPollResultByPollIdResponse, GetPrfsPollsRequest, GetPrfsPollsResponse,
    SubmitPrfsPollResponseRequest, SubmitPrfsPollResponseResponse,
};
use std::sync::Arc;

pub async fn get_prfs_polls(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsPollsRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsPollsResponse>>) {
    let pool = &state.db2.pool;
    let (prfs_polls, table_row_count) =
        prfs::get_prfs_polls(&pool, input.page_idx, input.page_size)
            .await
            .unwrap();

    let resp = ApiResponse::new_success(GetPrfsPollsResponse {
        page_idx: input.page_idx,
        table_row_count,
        prfs_polls,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_poll_by_poll_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsPollByPollIdRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsPollByPollIdResponse>>) {
    let pool = &state.db2.pool;
    let prfs_poll = prfs::get_prfs_poll_by_poll_id(&pool, &input.poll_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsPollByPollIdResponse { prfs_poll });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_poll_result_by_poll_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsPollResultByPollIdRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<GetPrfsPollResultByPollIdResponse>>,
) {
    let pool = &state.db2.pool;
    let prfs_poll_responses = prfs::get_prfs_poll_responses_by_poll_id(&pool, &input.poll_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsPollResultByPollIdResponse {
        prfs_poll_responses,
    });

    return (StatusCode::OK, Json(resp));
}

pub async fn create_prfs_poll(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsPollRequest>,
) -> (StatusCode, Json<ApiResponse<CreatePrfsPollResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let poll_id = prfs::insert_prfs_poll(&mut tx, &input).await.unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsPollResponse { poll_id });
    return (StatusCode::OK, Json(resp));
}

pub async fn submit_prfs_poll_response(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<SubmitPrfsPollResponseRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<SubmitPrfsPollResponseResponse>>,
) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let proof_instance_id_bytes = input.proof_instance_id.as_bytes();
    let short_id = &base_62::encode(proof_instance_id_bytes)[..8];

    let partial_proof = input.proof[..10]
        .iter()
        .map(|n| n.to_string())
        .collect::<String>();

    let ack_msg = format!(
        "ack/proof_instance_id:{}/partial_proof:{}",
        input.proof_instance_id, partial_proof,
    );

    let prfs_ack_sig = state
        .wallet
        .sign_message(ack_msg)
        .await
        .unwrap()
        .to_string();

    let prfs_proof_instance = PrfsProofInstance {
        proof_instance_id: input.proof_instance_id.to_string(),
        proof_type_id: input.proof_type_id.to_string(),
        short_id: short_id.to_string(),
        proof: input.proof.to_vec(),
        public_inputs: input.public_inputs.clone(),
        prfs_ack_sig: prfs_ack_sig.to_string(),
        created_at: chrono::offset::Utc::now(),
    };

    let _proof_instance_id =
        prfs::insert_prfs_proof_instances(&mut tx, &vec![prfs_proof_instance]).await;

    let poll_id = prfs::insert_prfs_poll_response(&mut tx, &input)
        .await
        .unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(SubmitPrfsPollResponseResponse { poll_id });
    return (StatusCode::OK, Json(resp));
}
