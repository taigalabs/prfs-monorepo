use hyper::{body::Incoming, Request};
use hyper_utils::{
    io::{parse_req, ApiHandlerResult},
    resp::ApiResponse,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::prfs_api_entities::{
    GetPrfsCircuitDriverByDriverIdRequest, GetPrfsCircuitDriverByDriverIdResponse,
    GetPrfsCircuitDriversRequest, GetPrfsCircuitDriversResponse,
};
use std::sync::Arc;

pub async fn get_prfs_circuit_drivers(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let pool = &state.clone().db2.pool;
    let req: GetPrfsCircuitDriversRequest = parse_req(req).await;
    let prfs_circuit_drivers = prfs::get_prfs_circuit_drivers(&pool).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitDriversResponse {
        page_idx: req.page_size,
        prfs_circuit_drivers,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_circuit_driver_by_driver_id(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let pool = &state.clone().db2.pool;
    let req: GetPrfsCircuitDriverByDriverIdRequest = parse_req(req).await;

    let prfs_circuit_driver =
        prfs::get_prfs_circuit_driver_by_circuit_driver_id(&pool, &req.circuit_driver_id).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitDriverByDriverIdResponse {
        prfs_circuit_driver,
    });

    return Ok(resp.into_hyper_response());
}
