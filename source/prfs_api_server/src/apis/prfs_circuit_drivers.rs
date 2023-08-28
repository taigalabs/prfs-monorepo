use crate::{
    responses::ApiResponse,
    server::{request::parse_req, state::ServerState},
};
use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    GetPrfsCircuitDriverByDriverIdRequest, GetPrfsCircuitDriverByDriverIdResponse,
    GetPrfsCircuitDriversRequest, GetPrfsCircuitDriversResponse,
};
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

pub async fn get_prfs_circuit_drivers(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let pool = &state.clone().db2.pool;

    let req: GetPrfsCircuitDriversRequest = parse_req(req).await;
    println!("req: {:?}", req);

    let prfs_circuit_drivers = db_apis::get_prfs_circuit_drivers(&pool).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitDriversResponse {
        page_idx: req.page_size,
        prfs_circuit_drivers,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_circuit_driver_by_driver_id(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let pool = &state.clone().db2.pool;

    let req: GetPrfsCircuitDriverByDriverIdRequest = parse_req(req).await;
    println!("req: {:?}", req);

    let prfs_circuit_driver =
        db_apis::get_prfs_circuit_driver_by_circuit_driver_id(&pool, &req.circuit_driver_id).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitDriverByDriverIdResponse {
        prfs_circuit_driver,
    });

    return Ok(resp.into_hyper_response());
}
