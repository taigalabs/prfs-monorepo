use crate::{
    responses::ApiResponse,
    server::{request::parse_req, state::ServerState},
};
use hyper::{body, Body, Request, Response};
use prfs_circuit_circom::CircuitBuildJson;
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{
        GetPrfsCircuitByCircuitIdRequest, GetPrfsCircuitByCircuitIdResponse,
        GetPrfsCircuitsRequest, GetPrfsCircuitsResponse,
    },
    syn_entities::PrfsCircuitSyn1,
};
use routerify::prelude::*;
use std::{convert::Infallible, sync::Arc};

pub async fn get_prfs_circuits(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: GetPrfsCircuitsRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_circuits_syn1 =
        db_apis::get_prfs_circuits_syn1(&pool, req.page_idx, req.page_size).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitsResponse {
        page_idx: req.page_idx,
        prfs_circuits_syn1,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_circuit_by_circuit_id(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: GetPrfsCircuitByCircuitIdRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_circuit_syn1 =
        db_apis::get_prfs_circuit_syn1_by_circuit_id(&pool, &req.circuit_id).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitByCircuitIdResponse { prfs_circuit_syn1 });

    return Ok(resp.into_hyper_response());
}
