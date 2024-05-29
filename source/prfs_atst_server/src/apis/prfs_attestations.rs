use prfs_atst_api_error_codes::PRFS_ATST_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    GetPrfsAttestationRequest, GetPrfsAttestationResponse, GetPrfsAttestationsByAtstGroupIdRequest,
    GetPrfsAttestationsResponse,
};
use std::sync::Arc;

const LIMIT: i32 = 10;

pub async fn get_prfs_attestations_by_atst_group_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsAttestationsByAtstGroupIdRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsAttestationsResponse>>) {
    let pool = &state.db2.pool;

    let rows = match prfs::get_prfs_attestations_by_atst_group_id(
        &pool,
        &input.atst_group_id,
        input.offset,
        LIMIT,
    )
    .await
    {
        Ok(r) => r,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("error getting prfs attestations: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let next_offset = if rows.len() == 0 {
        None
    } else {
        Some(input.offset + 1)
    };

    let resp = ApiResponse::new_success(GetPrfsAttestationsResponse { rows, next_offset });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_attestation(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsAttestationRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsAttestationResponse>>) {
    let pool = &state.db2.pool;

    let prfs_attestation = match prfs::get_prfs_attestation(&pool, &input.atst_id).await {
        Ok(a) => a,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetPrfsAttestationResponse { prfs_attestation });
    return (StatusCode::OK, Json(resp));
}
