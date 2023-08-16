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

    unimplemented!()

    // println!("req: {:?}", req);

    // match req.proof_instance_id {
    //     Some(proof_type_id) => {
    //         let prfs_proof_types = db_apis::get_prfs_proof_type(pool, &proof_type_id).await;
    //         let resp = ApiResponse::new_success(GetPrfsProofInstancesRespPayload {
    //             page: req.page,
    //             prfs_proof_types,
    //         });
    //         return Ok(resp.into_hyper_response());
    //     }
    //     None => {
    //         let prfs_proof_types = db_apis::get_prfs_proof_types(pool).await;
    //         let resp = ApiResponse::new_success(GetPrfsProofTypeRespPayload {
    //             page: req.page,
    //             prfs_proof_types,
    //         });
    //         return Ok(resp.into_hyper_response());
    //     }
    // };
}

#[derive(Serialize, Deserialize, Debug)]
struct CreatePrfsProofInstancesRequest {
    proof_type_id: String,
    author: String,
    label: String,
    desc: String,
    circuit_id: String,
    driver_id: String,
    circuit_inputs: HashMap<u32, CircuitInput>,
    driver_properties: HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct CreatePrfsProofTypesRespPayload {
    // prfs_proof_types: Vec<PrfsProofType>,
}

pub async fn create_prfs_proof_instances(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<CreatePrfsProofInstancesRequest>(&body_str)
        .expect("req request should be parsable");

    println!("req: {:?}", req);

    unimplemented!();

    // let prfs_proof_type = PrfsProofInstance {
    //     proof_type_id: req.proof_type_id.to_string(),
    //     // label: req.label.to_string(),
    //     // author: req.author.to_string(),
    //     // desc: req.desc.to_string(),

    //     // circuit_id: req.circuit_id.to_string(),
    //     // driver_id: req.driver_id.to_string(),
    //     // circuit_inputs: Json::from(req.circuit_inputs.clone()),
    //     // driver_properties: Json::from(req.driver_properties.clone()),

    //     // created_at: chrono::offset::Utc::now(),
    // };

    // db_apis::insert_prfs_proof_types(&mut tx, &vec![prfs_proof_type]).await;

    // tx.commit().await.unwrap();

    // let resp = ApiResponse::new_success(CreatePrfsProofTypesRespPayload {});

    // return Ok(resp.into_hyper_response());
}
