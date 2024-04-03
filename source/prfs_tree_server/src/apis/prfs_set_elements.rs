use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_axum_lib::{resp::ApiResponse, ApiHandleError};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::tree_api::{
    GetPrfsSetElementRequest, GetPrfsSetElementResponse, GetPrfsSetElementsRequest,
    GetPrfsSetElementsResponse,
};
use prfs_entities::{
    ImportPrfsAttestationsToPrfsSetRequest, ImportPrfsAttestationsToPrfsSetResponse,
};
use prfs_tree_api_error_codes::PRFS_TREE_API_ERROR_CODES;
use std::sync::Arc;

use crate::ops::_import_prfs_attestations_to_prfs_set;

const LIMIT: i32 = 20;

pub async fn import_prfs_attestations_to_prfs_set(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<ImportPrfsAttestationsToPrfsSetRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<ImportPrfsAttestationsToPrfsSetResponse>>,
) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR);

    let (set_id, rows_affected) = match _import_prfs_attestations_to_prfs_set(
        &mut tx,
        &input.topic,
        &input.dest_set_id,
    )
    .await
    {
        Ok(r) => r,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    bail_out_tx_commit!(tx, &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR);
    let resp = ApiResponse::new_success(ImportPrfsAttestationsToPrfsSetResponse {
        set_id,
        rows_affected,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_set_elements(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsSetElementsRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsSetElementsResponse>>) {
    let pool = &state.db2.pool;

    let rows = match prfs::get_prfs_set_elements(&pool, &input.set_id, input.offset, LIMIT).await {
        Ok(r) => r,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let row_count: i32 = match rows.len().try_into() {
        Ok(c) => c,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let next_offset = if row_count < LIMIT {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetPrfsSetElementsResponse { rows, next_offset });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_set_element(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsSetElementRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsSetElementResponse>>) {
    let pool = &state.db2.pool;

    let prfs_set_element = match prfs::get_prfs_set_element(&pool, &input.set_id, &input.label)
        .await
    {
        Ok(e) => e,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetPrfsSetElementResponse { prfs_set_element });
    return (StatusCode::OK, Json(resp));
}
