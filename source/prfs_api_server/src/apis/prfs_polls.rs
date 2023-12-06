use ethers_signers::Signer;
use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::BytesBoxBody;
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    CreatePrfsPollRequest, CreatePrfsPollResponse, GetPrfsPollByPollIdRequest,
    GetPrfsPollByPollIdResponse, GetPrfsPollResultByPollIdRequest,
    GetPrfsPollResultByPollIdResponse, GetPrfsPollsRequest, GetPrfsPollsResponse,
    SubmitPrfsPollResponseRequest, SubmitPrfsPollResponseResponse,
};
use prfs_entities::entities::{PrfsPoll, PrfsProofInstance};
use std::{convert::Infallible, sync::Arc};
use uuid::Uuid;

use crate::responses::ApiResponse;
use crate::server::request::parse_req;
use crate::server::state::ServerState;

pub async fn get_prfs_polls(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, Infallible> {
    let req: GetPrfsPollsRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let (prfs_polls, table_row_count) = db_apis::get_prfs_polls(&pool, req.page_idx, req.page_size)
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
) -> Result<Response<BytesBoxBody>, Infallible> {
    let req: GetPrfsPollByPollIdRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_poll = db_apis::get_prfs_poll_by_poll_id(&pool, &req.poll_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsPollByPollIdResponse { prfs_poll });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_poll_result_by_poll_id(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, Infallible> {
    let req: GetPrfsPollResultByPollIdRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_poll_responses = db_apis::get_prfs_poll_responses_by_poll_id(&pool, &req.poll_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsPollResultByPollIdResponse {
        prfs_poll_responses,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn create_prfs_poll(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, Infallible> {
    let req: CreatePrfsPollRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let poll_id = db_apis::insert_prfs_poll(&mut tx, &req).await.unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsPollResponse { poll_id });

    return Ok(resp.into_hyper_response());
}

pub async fn submit_prfs_poll_response(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, Infallible> {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let req: SubmitPrfsPollResponseRequest = parse_req(req).await;
    let proof_instance_id_128 = req.proof_instance_id.as_u128();
    let short_id = &base62::encode(proof_instance_id_128)[..8];

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
        proof_instance_id: req.proof_instance_id,
        proof_type_id: req.proof_type_id.to_string(),
        short_id: short_id.to_string(),
        proof: req.proof.to_vec(),
        public_inputs: req.public_inputs.clone(),
        prfs_ack_sig: prfs_ack_sig.to_string(),
        created_at: chrono::offset::Utc::now(),
    };

    let _proof_instance_id =
        db_apis::insert_prfs_proof_instances(&mut tx, &vec![prfs_proof_instance]).await;

    let poll_id = db_apis::insert_prfs_poll_response(&mut tx, &req)
        .await
        .unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(SubmitPrfsPollResponseResponse { poll_id });

    return Ok(resp.into_hyper_response());
}
