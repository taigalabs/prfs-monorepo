use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
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
) -> (
    StatusCode,
    Json<ApiResponse<GetPrfsCircuitTypeByCircuitTypeIdResponse>>,
) {
    let pool = &state.db2.pool;
    let prfs_circuit_type =
        prfs::get_prfs_circuit_type_by_circuit_type_id(&pool, &input.circuit_type_id).await;

    let resp =
        ApiResponse::new_success(GetPrfsCircuitTypeByCircuitTypeIdResponse { prfs_circuit_type });
    return (StatusCode::OK, Json(resp));
}
