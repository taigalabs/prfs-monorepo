use prfs_axum_lib::axum::extract::State;
use prfs_axum_lib::axum::{http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::prfs_api::{
    GetPrfsCircuitByCircuitIdRequest, GetPrfsCircuitByCircuitIdResponse, GetPrfsCircuitsRequest,
    GetPrfsCircuitsResponse,
};
use std::sync::Arc;

pub async fn get_prfs_circuits(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsCircuitsRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsCircuitsResponse>>) {
    let pool = &state.db2.pool;
    let prfs_circuits_syn1 =
        prfs::get_prfs_circuits_syn1(&pool, input.page_idx, input.page_size).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitsResponse {
        page_idx: input.page_idx,
        prfs_circuits_syn1,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_circuit_by_circuit_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsCircuitByCircuitIdRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<GetPrfsCircuitByCircuitIdResponse>>,
) {
    // let req: GetPrfsCircuitByCircuitIdRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_circuit_syn1 =
        prfs::get_prfs_circuit_syn1_by_circuit_id(&pool, &input.circuit_id).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitByCircuitIdResponse { prfs_circuit_syn1 });
    return (StatusCode::OK, Json(resp));
}
