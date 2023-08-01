use crate::{responses::ApiResponse, state::ServerState, ApiServerError};
use chrono::NaiveDate;
use hyper::{body, Body, Request, Response};
use prfs_db_interface::models::{PrfsProofType, PrfsSet};
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
struct GetPrfsProofTypesRequest {
    proof_type_id: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetPrfsProofTypeRespPayload {
    prfs_proof_types: Vec<PrfsProofType>,
}

pub async fn get_prfs_proof_types(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("get proof types");

    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetPrfsProofTypesRequest>(&body_str).unwrap();

    println!("req: {:?}", req);

    let prfs_proof_types = state.db2.get_prfs_proof_types(&req.proof_type_id).await;

    let resp = ApiResponse::new_success(GetPrfsProofTypeRespPayload { prfs_proof_types });

    return Ok(resp.into_hyper_response());
}

#[derive(Serialize, Deserialize, Debug)]
struct InsertPrfsProofTypesRequest {
    proof_type_id: String,
    author: String,
    label: String,
    desc: String,
    circuit_id: String,
    public_inputs: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct InsertPrfsProofTypesRespPayload {
    // prfs_proof_types: Vec<PrfsProofType>,
}

pub async fn insert_prfs_proof_types(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("111");
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<InsertPrfsProofTypesRequest>(&body_str)
        .expect("req request should be parsable");

    println!("req: {:?}", req);

    // let mut where_clause = String::new();

    // if let Some(set_id) = req.set_id {
    //     where_clause = format!("where set_id='{}'", &set_id);
    // }

    let prfs_proof_type = PrfsProofType {
        proof_type_id: req.proof_type_id.to_string(),
        label: req.label.to_string(),
        author: req.author.to_string(),
        desc: req.desc.to_string(),

        circuit_id: req.circuit_id.to_string(),
        public_inputs: req.public_inputs.to_string(),

        created_at: NaiveDate::from_ymd_opt(1, 2, 1).unwrap(),
    };

    let prfs_proof_types = state
        .db2
        .insert_prfs_proof_types(&vec![prfs_proof_type])
        .await;

    let resp = ApiResponse::new_success(InsertPrfsProofTypesRespPayload {});

    return Ok(resp.into_hyper_response());
}
