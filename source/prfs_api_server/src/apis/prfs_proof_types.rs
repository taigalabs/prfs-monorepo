use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{
        CreatePrfsProofTypesRequest, CreatePrfsProofTypesResponse, GetPrfsProofTypeResponse,
        GetPrfsProofTypesRequest,
    },
    entities::{CircuitInput, PrfsProofType, PrfsSet},
    sqlx::types::Json,
};
use routerify::prelude::*;
use std::{convert::Infallible, sync::Arc};

use crate::{
    responses::ApiResponse,
    server::{request::parse_req, state::ServerState},
    ApiServerError,
};

pub async fn get_prfs_proof_types(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: GetPrfsProofTypesRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    match req.proof_type_id {
        Some(proof_type_id) => {
            let prfs_proof_types = db_apis::get_prfs_proof_type(pool, &proof_type_id).await;
            let resp = ApiResponse::new_success(GetPrfsProofTypeResponse {
                page: req.page,
                prfs_proof_types,
            });
            return Ok(resp.into_hyper_response());
        }
        None => {
            let prfs_proof_types = db_apis::get_prfs_proof_types(pool).await;
            let resp = ApiResponse::new_success(GetPrfsProofTypeResponse {
                page: req.page,
                prfs_proof_types,
            });
            return Ok(resp.into_hyper_response());
        }
    };
}

pub async fn create_prfs_proof_types(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: CreatePrfsProofTypesRequest = parse_req(req).await;

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
        circuit_type: req.circuit_type.to_string(),
        circuit_driver_id: req.circuit_driver_id.to_string(),
        circuit_inputs: Json::from(req.circuit_inputs.clone()),
        driver_properties: Json::from(req.driver_properties.clone()),

        created_at: chrono::offset::Utc::now(),
    };

    let id = db_apis::insert_prfs_proof_type(&mut tx, &prfs_proof_type).await;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsProofTypesResponse { id });

    return Ok(resp.into_hyper_response());
}
