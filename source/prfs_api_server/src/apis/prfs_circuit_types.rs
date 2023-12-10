use crate::{responses::ApiResponse, server::types::ApiHandlerResult};
use hyper::{body::Incoming, Request};
use hyper_utils::io::parse_req;
use prfs_common_server_state::ServerState;
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{
        GetPrfsCircuitTypeByCircuitTypeIdRequest, GetPrfsCircuitTypeByCircuitTypeIdResponse,
        GetPrfsCircuitTypesRequest, GetPrfsCircuitTypesResponse,
    },
    entities::{PrfsCircuitDriver, PrfsCircuitType},
};
use std::sync::Arc;

pub async fn get_prfs_circuit_types(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetPrfsCircuitTypesRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_circuit_types = db_apis::get_prfs_circuit_types(&pool).await;

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
        db_apis::get_prfs_circuit_type_by_circuit_type_id(&pool, &req.circuit_type_id).await;

    let resp =
        ApiResponse::new_success(GetPrfsCircuitTypeByCircuitTypeIdResponse { prfs_circuit_type });

    return Ok(resp.into_hyper_response());
}
