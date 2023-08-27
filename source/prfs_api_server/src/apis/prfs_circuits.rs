use crate::{
    responses::ApiResponse,
    server::{request::parse_req, state::ServerState},
};
use hyper::{body, Body, Request, Response};
use prfs_circuit_circom::CircuitBuildJson;
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{GetCircuitsRequest, GetCircuitsResponse},
    syn_entities::PrfsCircuitSyn1,
};
use routerify::prelude::*;
use std::{convert::Infallible, sync::Arc};

pub async fn get_prfs_native_circuits(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: GetCircuitsRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_circuits_syn1 = if let Some(circuit_id) = req.circuit_id {
        db_apis::get_prfs_circuit_syn1(&pool, &circuit_id).await
    } else {
        db_apis::get_prfs_circuits_syn1(&pool).await
    };

    let resp = ApiResponse::new_success(GetCircuitsResponse {
        page: 0,
        prfs_circuits_syn1,
    });

    return Ok(resp.into_hyper_response());
}
