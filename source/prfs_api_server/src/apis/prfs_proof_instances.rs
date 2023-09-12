use ethers_signers::Signer;
use hyper::{Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    CreatePrfsProofInstanceRequest, CreatePrfsProofInstanceResponse,
    GetPrfsProofInstanceByInstanceIdRequest, GetPrfsProofInstanceByInstanceIdResponse,
    GetPrfsProofInstanceByShortIdRequest, GetPrfsProofInstanceByShortIdResponse,
    GetPrfsProofInstancesRequest, GetPrfsProofInstancesResponse,
};
use prfs_entities::entities::PrfsProofInstance;
use routerify::prelude::*;
use std::{convert::Infallible, sync::Arc};

use crate::responses::ApiResponse;
use crate::server::request::parse_req;
use crate::server::state::ServerState;

pub async fn get_prfs_proof_instances(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let req: GetPrfsProofInstancesRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let (prfs_proof_instances_syn1, table_row_count) =
        db_apis::get_prfs_proof_instances_syn1(pool, req.page_idx, req.page_size).await;

    let resp = ApiResponse::new_success(GetPrfsProofInstancesResponse {
        page_idx: req.page_idx,
        table_row_count,
        prfs_proof_instances_syn1,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_proof_instance_by_instance_id(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: GetPrfsProofInstanceByInstanceIdRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_proof_instance_syn1 =
        db_apis::get_prfs_proof_instance_syn1_by_instance_id(pool, &req.proof_instance_id).await;

    let resp = ApiResponse::new_success(GetPrfsProofInstanceByInstanceIdResponse {
        prfs_proof_instance_syn1,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_proof_instance_by_short_id(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: GetPrfsProofInstanceByShortIdRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_proof_instance =
        db_apis::get_prfs_proof_instance_by_short_id(pool, &req.short_id).await;

    let resp = ApiResponse::new_success(GetPrfsProofInstanceByShortIdResponse {
        prfs_proof_instance,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn create_prfs_proof_instance(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: CreatePrfsProofInstanceRequest = parse_req(req).await;

    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let proof_instance_id_128 = req.proof_instance_id.as_u128();
    let short_id = &base62::encode(proof_instance_id_128)[..8];

    let prfs_proof_instance = PrfsProofInstance {
        proof_instance_id: req.proof_instance_id,
        proof_type_id: req.proof_type_id,
        short_id: short_id.to_string(),
        proof: req.proof.to_vec(),
        public_inputs: req.public_inputs.clone(),
        created_at: chrono::offset::Utc::now(),
    };

    let partial_proof = req.proof[..10]
        .iter()
        .map(|n| n.to_string())
        .collect::<String>();

    let ack_msg = format!(
        "ack/proof_instance_id:{}/partial_proof:{}",
        req.proof_instance_id, partial_proof,
    );

    let ack_sign = state
        .wallet
        .sign_message(ack_msg)
        .await
        .unwrap()
        .to_string();

    let proof_instance_id =
        db_apis::insert_prfs_proof_instances(&mut tx, &vec![prfs_proof_instance]).await;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsProofInstanceResponse {
        proof_instance_id,
        ack_sign,
    });

    return Ok(resp.into_hyper_response());
}
