use hyper::{body::Incoming, Request, Response};
use hyper_utils::io::BytesBoxBody;
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{
        CreatePrfsProofTypeRequest, CreatePrfsProofTypeResponse,
        GetPrfsProofTypeByProofTypeIdRequest, GetPrfsProofTypeByProofTypeIdResponse,
        GetPrfsProofTypesRequest, GetPrfsProofTypesResponse,
    },
    entities::{CircuitInput, PrfsProofType, PrfsSet},
    sqlx::types::Json,
};
// use routerify::prelude::*;
use std::{convert::Infallible, sync::Arc};

use crate::{
    responses::ApiResponse,
    server::{request::parse_req, state::ServerState},
    ApiServerError,
};

pub async fn get_prfs_proof_types(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, Infallible> {
    let req: GetPrfsProofTypesRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_proof_types = db_apis::get_prfs_proof_types(pool, req.page_idx, req.page_size).await;

    let next_idx = if (prfs_proof_types.len() as i32) < req.page_size {
        -1
    } else {
        req.page_idx + 1
    };

    let resp = ApiResponse::new_success(GetPrfsProofTypesResponse {
        next_idx,
        prfs_proof_types,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_proof_type_by_proof_type_id(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, Infallible> {
    let req: GetPrfsProofTypeByProofTypeIdRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_proof_type =
        db_apis::get_prfs_proof_type_by_proof_type_id(pool, &req.proof_type_id).await;

    let resp = ApiResponse::new_success(GetPrfsProofTypeByProofTypeIdResponse { prfs_proof_type });

    return Ok(resp.into_hyper_response());
}

pub async fn create_prfs_proof_type(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, Infallible> {
    let req: CreatePrfsProofTypeRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let prfs_proof_type = PrfsProofType {
        proof_type_id: req.proof_type_id,
        label: req.label.to_string(),
        author: req.author.to_string(),
        desc: req.desc.to_string(),
        expression: req.expression.to_string(),
        img_url: req.img_url,
        img_caption: req.img_caption,
        circuit_id: req.circuit_id,
        circuit_type_id: req.circuit_type_id.to_string(),
        circuit_driver_id: req.circuit_driver_id.to_string(),
        circuit_inputs: Json::from(req.circuit_inputs.clone()),
        driver_properties: Json::from(req.driver_properties.clone()),

        created_at: chrono::offset::Utc::now(),
    };

    let id = db_apis::insert_prfs_proof_type(&mut tx, &prfs_proof_type).await;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsProofTypeResponse { id });

    return Ok(resp.into_hyper_response());
}
