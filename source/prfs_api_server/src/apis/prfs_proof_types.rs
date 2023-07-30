use crate::{responses::ApiResponse, state::ServerState, ApiServerError};
use chrono::NaiveDate;
use hyper::{body, Body, Request, Response};
use prfs_circuits_circom::CircuitBuildDetail;
use prfs_db_interface::models::{PrfsProofType, PrfsSet};
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
struct InsertPrfsProofTypesRequest {
    // power: usize,
    // page: usize,
    // set_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct InsertPrfsProofTypesRespPayload {
    // page: usize,
    // prfs_sets: Vec<PrfsSet>,
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
        proof_type_id: "11".to_string(),
        label: "label".to_string(),
        author: "author".to_string(),
        desc: "desc".to_string(),

        circuit_id: "circuit_id".to_string(),
        public_inputs: "public_inputs".to_string(),

        created_at: NaiveDate::from_ymd_opt(1, 2, 1).unwrap(),
    };

    let prfs_sets = state
        .db2
        .insert_prfs_proof_types(&vec![prfs_proof_type])
        .await;

    let resp = ApiResponse::new_success(InsertPrfsProofTypesRespPayload {});

    return Ok(resp.into_hyper_response());
}
