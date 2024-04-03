use prfs_api_error_codes::PRFS_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::prfs_api::{
    CreatePrfsSetRequest, CreatePrfsSetResponse, GetPrfsSetBySetIdRequest,
    GetPrfsSetBySetIdResponse, GetPrfsSetsRequest, GetPrfsSetsResponse,
};
use std::sync::Arc;

pub async fn get_prfs_sets(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsSetsRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsSetsResponse>>) {
    let pool = &state.db2.pool;
    let prfs_sets = match prfs::get_prfs_sets(pool, input.page_idx, input.page_size).await {
        Ok(s) => s,
        Err(err) => {
            let resp = ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetPrfsSetsResponse {
        page_idx: input.page_idx,
        page_size: input.page_size,
        prfs_sets,
    });

    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_set_by_set_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsSetBySetIdRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsSetBySetIdResponse>>) {
    let pool = &state.db2.pool;
    let prfs_set = match prfs::get_prfs_set_by_set_id(pool, &input.set_id).await {
        Ok(s) => s,
        Err(err) => {
            let resp = ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetPrfsSetBySetIdResponse { prfs_set });
    return (StatusCode::OK, Json(resp));
}

pub async fn create_prfs_set(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsSetRequest>,
) -> (StatusCode, Json<ApiResponse<CreatePrfsSetResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &PRFS_API_ERROR_CODES.UNKNOWN_ERROR);

    let set_id = match prfs::insert_prfs_set_ins1(&mut tx, &input.prfs_set_ins1).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(CreatePrfsSetResponse { set_id });

    bail_out_tx_commit!(tx, &PRFS_API_ERROR_CODES.UNKNOWN_ERROR);

    return (StatusCode::OK, Json(resp));
}
