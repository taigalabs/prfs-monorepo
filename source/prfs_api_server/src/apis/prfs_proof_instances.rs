use chrono::{DateTime, NaiveDate, NaiveDateTime};
use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    CreatePrfsProofInstanceRequest, CreatePrfsProofInstanceResponse,
    GetPrfsProofInstanceByInstanceIdRequest, GetPrfsProofInstanceByInstanceIdResponse,
    GetPrfsProofInstanceByShortIdRequest, GetPrfsProofInstancesByShortIdResponse,
    GetPrfsProofInstancesRequest, GetPrfsProofInstancesResponse,
};
use prfs_entities::{
    entities::{CircuitInput, PrfsProofInstance, PrfsProofType, PrfsSet},
    syn_entities::PrfsProofInstanceSyn1,
};
use routerify::prelude::*;
use std::{collections::HashMap, convert::Infallible, sync::Arc};

use crate::{responses::ApiResponse, state::ServerState, ApiServerError};

pub async fn get_prfs_proof_instances(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let pool = &state.db2.pool;

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetPrfsProofInstancesRequest>(&body_str).unwrap();

    println!("req: {:?}", req);

    let prfs_proof_instances_syn1 =
        db_apis::get_prfs_proof_instances_syn1(pool, req.page_idx, req.page_size).await;

    let resp = ApiResponse::new_success(GetPrfsProofInstancesResponse {
        page_idx: req.page_idx,
        prfs_proof_instances_syn1,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_proof_instance_by_instance_id(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();
    let pool = &state.db2.pool;

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetPrfsProofInstanceByInstanceIdRequest>(&body_str).unwrap();

    println!("req: {:?}", req);

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
    println!("get proof types");

    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();
    let pool = &state.db2.pool;

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetPrfsProofInstanceByShortIdRequest>(&body_str).unwrap();

    println!("req: {:?}", req);

    let prfs_proof_instance =
        db_apis::get_prfs_proof_instance_by_short_id(pool, &req.short_id).await;

    let resp = ApiResponse::new_success(GetPrfsProofInstancesByShortIdResponse {
        prfs_proof_instance,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn create_prfs_proof_instance(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<CreatePrfsProofInstanceRequest>(&body_str)
        .expect("req request should be parsable");

    // println!("req: {:?}", req);

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

    let proof_instance_id =
        db_apis::insert_prfs_proof_instances(&mut tx, &vec![prfs_proof_instance]).await;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsProofInstanceResponse { proof_instance_id });

    return Ok(resp.into_hyper_response());
}
