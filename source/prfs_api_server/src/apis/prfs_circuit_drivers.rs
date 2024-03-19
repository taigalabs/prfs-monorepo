use prfs_api_error_codes::PRFS_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
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
    let prfs_circuit_drivers = match prfs::get_prfs_circuit_drivers(&pool).await {
        Ok(d) => d,
        Err(err) => {
            let resp = ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

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
        match prfs::get_prfs_circuit_driver_by_circuit_driver_id(&pool, &input.circuit_driver_id)
            .await
        {
            Ok(d) => d,
            Err(err) => {
                let resp =
                    ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };

    let resp = ApiResponse::new_success(GetPrfsCircuitDriverByDriverIdResponse {
        prfs_circuit_driver,
    });
    return (StatusCode::OK, Json(resp));
}
