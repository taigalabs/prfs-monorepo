use hyper::{body::Incoming, Request};
use hyper_utils::{
    io::{parse_req, ApiHandlerResult},
    resp::ApiResponse,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::prfs_api::{
    GetPrfsCircuitTypeByCircuitTypeIdRequest, GetPrfsCircuitTypeByCircuitTypeIdResponse,
    GetPrfsCircuitTypesRequest, GetPrfsCircuitTypesResponse,
};
use std::sync::Arc;

pub async fn get_prfs_circuit_types(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetPrfsCircuitTypesRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_circuit_types = prfs::get_prfs_circuit_types(&pool).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitTypesResponse {
        page_idx: req.page_idx,
        prfs_circuit_types,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_circuit_type_by_circuit_type_id(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetPrfsCircuitTypeByCircuitTypeIdRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_circuit_type =
        prfs::get_prfs_circuit_type_by_circuit_type_id(&pool, &req.circuit_type_id).await;

    let resp =
        ApiResponse::new_success(GetPrfsCircuitTypeByCircuitTypeIdResponse { prfs_circuit_type });

    return Ok(resp.into_hyper_response());
}
