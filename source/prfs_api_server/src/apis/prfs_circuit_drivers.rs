use axum::{
    extract::{MatchedPath, Request, State},
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::{get, post},
    Json, Router,
};
use hyper::body::Incoming;
use prfs_axum_lib::{
    io::{parse_req, ApiHandlerResult},
    resp::ApiResponse,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::prfs_api::{
    GetPrfsCircuitDriverByDriverIdRequest, GetPrfsCircuitDriverByDriverIdResponse,
    GetPrfsCircuitDriversRequest, GetPrfsCircuitDriversResponse,
};
use std::sync::Arc;

pub async fn get_prfs_circuit_drivers(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsCircuitDriversRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsCircuitDriversResponse>>) {
    let pool = &state.clone().db2.pool;
    let prfs_circuit_drivers = prfs::get_prfs_circuit_drivers(&pool).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitDriversResponse {
        page_idx: input.page_size,
        prfs_circuit_drivers,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_circuit_driver_by_driver_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsCircuitDriverByDriverIdRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<GetPrfsCircuitDriverByDriverIdResponse>>,
) {
    let pool = &state.clone().db2.pool;
    let prfs_circuit_driver =
        prfs::get_prfs_circuit_driver_by_circuit_driver_id(&pool, &input.circuit_driver_id).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitDriverByDriverIdResponse {
        prfs_circuit_driver,
    });
    return (StatusCode::OK, Json(resp));
}
