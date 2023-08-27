use crate::{
    responses::ApiResponse,
    server::{request::parse_req, state::ServerState},
};
use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{GetCircuitDriversRequest, GetCircuitDriversResponse},
    entities::PrfsCircuitDriver,
};
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

pub async fn get_prfs_native_circuit_drivers(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let pool = &state.clone().db2.pool;

    let req: GetCircuitDriversRequest = parse_req(req).await;

    println!("req: {:?}", req);

    let prfs_circuit_drivers = if let Some(circuit_driver_id) = req.circuit_driver_id {
        db_apis::get_prfs_circuit_driver_by_circuit_driver_id(&pool, &circuit_driver_id).await
    } else {
        db_apis::get_prfs_circuit_drivers(&pool).await
    };

    let resp = ApiResponse::new_success(GetCircuitDriversResponse {
        page: 0,
        prfs_circuit_drivers,
    });

    return Ok(resp.into_hyper_response());
}
