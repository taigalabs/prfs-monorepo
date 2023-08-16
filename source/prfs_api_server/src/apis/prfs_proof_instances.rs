use crate::{responses::ApiResponse, state::ServerState, ApiServerError};
use chrono::{DateTime, NaiveDate, NaiveDateTime};
use hyper::{body, Body, Request, Response};
use prfs_db_interface::{db_apis, sqlx::types::Json};
use prfs_entities::entities::{CircuitInput, PrfsProofInstance, PrfsProofType, PrfsSet};
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
struct GetPrfsProofInstancesRequest {
    page: u32,
    proof_instance_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetPrfsProofInstancesRespPayload {
    page: u32,
    prfs_proof_instances: Vec<PrfsProofInstance>,
}

pub async fn get_prfs_proof_instances(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("get proof types");

    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let pool = &state.db2.pool;
    // let mut tx = pool.begin().await.unwrap();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetPrfsProofInstancesRequest>(&body_str).unwrap();

    // println!("req: {:?}", req);

    match req.proof_instance_id {
        Some(proof_instance_id) => {
            let prfs_proof_instances =
                db_apis::get_prfs_proof_instance(pool, &proof_instance_id).await;
            let resp = ApiResponse::new_success(GetPrfsProofInstancesRespPayload {
                page: req.page,
                prfs_proof_instances,
            });
            return Ok(resp.into_hyper_response());
        }
        None => {
            let prfs_proof_instances = db_apis::get_prfs_proof_instances(pool).await;
            let resp = ApiResponse::new_success(GetPrfsProofInstancesRespPayload {
                page: req.page,
                prfs_proof_instances,
            });
            return Ok(resp.into_hyper_response());
        }
    };
}

#[derive(Serialize, Deserialize, Debug)]
struct CreatePrfsProofInstanceRequest {
    sig: String,
    proof_type_id: String,
    proof: Vec<u8>,
    public_inputs: sqlx::types::Json<serde_json::Value>,
}

#[derive(Serialize, Deserialize, Debug)]
struct CreatePrfsProofInstanceRespPayload {
    // prfs_proof_types: Vec<PrfsProofType>,
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

    println!("req: {:?}", req);

    let prfs_proof_instance = PrfsProofInstance {
        proof_instance_id: chrono::offset::Utc::now().to_string(),
        proof_type_id: req.proof_type_id.to_string(),
        sig: req.sig.to_string(),
        proof: req.proof.to_vec(),
        public_inputs: req.public_inputs.clone(),
        created_at: chrono::offset::Utc::now(),
    };

    db_apis::insert_prfs_proof_instances(&mut tx, &vec![prfs_proof_instance]).await;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsProofInstanceRespPayload {});

    return Ok(resp.into_hyper_response());
}
