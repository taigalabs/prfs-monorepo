use ethers_signers::Signer;
use hyper::body::Incoming;
use hyper::Request;
use hyper_utils::io::{parse_req, ApiHandlerResult};
use hyper_utils::resp::ApiResponse;
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

pub async fn get_prfs_polls(req: Request<Incoming>, state: Arc<ServerState>) -> ApiHandlerResult {
    let req: GetPrfsPollsRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let (prfs_polls, table_row_count) = prfs::get_prfs_polls(&pool, req.page_idx, req.page_size)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsPollsResponse {
        page_idx: req.page_idx,
        table_row_count,
        prfs_polls,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_poll_by_poll_id(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetPrfsPollByPollIdRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_poll = prfs::get_prfs_poll_by_poll_id(&pool, &req.poll_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsPollByPollIdResponse { prfs_poll });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_poll_result_by_poll_id(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetPrfsPollResultByPollIdRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_poll_responses = prfs::get_prfs_poll_responses_by_poll_id(&pool, &req.poll_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsPollResultByPollIdResponse {
        prfs_poll_responses,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn create_prfs_poll(req: Request<Incoming>, state: Arc<ServerState>) -> ApiHandlerResult {
    let req: CreatePrfsPollRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let poll_id = prfs::insert_prfs_poll(&mut tx, &req).await.unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsPollResponse { poll_id });

    return Ok(resp.into_hyper_response());
}

pub async fn submit_prfs_poll_response(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let req: SubmitPrfsPollResponseRequest = parse_req(req).await;
    let proof_instance_id_bytes = req.proof_instance_id.as_bytes();
    let short_id = &base_62::encode(proof_instance_id_bytes)[..8];

    let partial_proof = req.proof[..10]
        .iter()
        .map(|n| n.to_string())
        .collect::<String>();

    let ack_msg = format!(
        "ack/proof_instance_id:{}/partial_proof:{}",
        req.proof_instance_id, partial_proof,
    );

    let prfs_ack_sig = state
        .wallet
        .sign_message(ack_msg)
        .await
        .unwrap()
        .to_string();

    let prfs_proof_instance = PrfsProofInstance {
        proof_instance_id: req.proof_instance_id.to_string(),
        proof_type_id: req.proof_type_id.to_string(),
        short_id: short_id.to_string(),
        proof: req.proof.to_vec(),
        public_inputs: req.public_inputs.clone(),
        prfs_ack_sig: prfs_ack_sig.to_string(),
        created_at: chrono::offset::Utc::now(),
    };

    let _proof_instance_id =
        prfs::insert_prfs_proof_instances(&mut tx, &vec![prfs_proof_instance]).await;

    let poll_id = prfs::insert_prfs_poll_response(&mut tx, &req)
        .await
        .unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(SubmitPrfsPollResponseResponse { poll_id });

    return Ok(resp.into_hyper_response());
}
