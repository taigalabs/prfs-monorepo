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
    GetPrfsCircuitTypeByCircuitTypeIdRequest, GetPrfsCircuitTypeByCircuitTypeIdResponse,
    GetPrfsCircuitTypesRequest, GetPrfsCircuitTypesResponse,
};
use std::sync::Arc;

pub async fn get_prfs_circuit_types(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsCircuitTypesRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsCircuitTypesResponse>>) {
    let pool = &state.db2.pool;
    let prfs_circuit_types = prfs::get_prfs_circuit_types(&pool).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitTypesResponse {
        page_idx: input.page_idx,
        prfs_circuit_types,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_circuit_type_by_circuit_type_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsCircuitTypeByCircuitTypeIdRequest>,
    // req: Request<Incoming>,
    // state: Arc<ServerState>,
) -> (
    StatusCode,
    Json<ApiResponse<GetPrfsCircuitTypeByCircuitTypeIdResponse>>,
) {
    // let req: GetPrfsCircuitTypeByCircuitTypeIdRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_circuit_type =
        prfs::get_prfs_circuit_type_by_circuit_type_id(&pool, &input.circuit_type_id).await;

    let resp =
        ApiResponse::new_success(GetPrfsCircuitTypeByCircuitTypeIdResponse { prfs_circuit_type });
    return (StatusCode::OK, Json(resp));
}
