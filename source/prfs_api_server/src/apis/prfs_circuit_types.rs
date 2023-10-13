use crate::{
    responses::ApiResponse,
    server::{request::parse_req, state::ServerState},
};
use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{
        GetPrfsCircuitTypeByCircuitTypeResponse, GetPrfsCircuitTypeByLabelRequest,
        GetPrfsCircuitTypesRequest, GetPrfsCircuitTypesResponse,
    },
    entities::{PrfsCircuitDriver, PrfsCircuitType},
};
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

pub async fn get_prfs_circuit_types(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let req: GetPrfsCircuitTypesRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_circuit_types = db_apis::get_prfs_circuit_types(&pool).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitTypesResponse {
        page_idx: req.page_idx,
        prfs_circuit_types,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_circuit_type_by_label(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let req: GetPrfsCircuitTypeByLabelRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_circuit_type = db_apis::get_prfs_circuit_type_by_label(&pool, &req.label).await;

    let resp =
        ApiResponse::new_success(GetPrfsCircuitTypeByCircuitTypeResponse { prfs_circuit_type });

    return Ok(resp.into_hyper_response());
}
