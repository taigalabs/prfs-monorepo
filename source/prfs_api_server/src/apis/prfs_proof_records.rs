use prfs_api_error_codes::PRFS_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::prfs_api::{
    CreatePrfsProofRecordRequest, CreatePrfsProofRecordResponse, GetPrfsProofRecordRequest,
    GetPrfsProofRecordResponse,
};
use std::sync::Arc;

// const LIMIT: i32 = 10;

pub async fn get_prfs_proof_record(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsProofRecordRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsProofRecordResponse>>) {
    let pool = &state.db2.pool;
    let proof_record = match prfs::get_prfs_proof_record(pool, &input.public_key).await {
        Ok(r) => r,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Error getting proof record, err: {:?}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetPrfsProofRecordResponse { proof_record });
    return (StatusCode::OK, Json(resp));
}

pub async fn create_prfs_proof_record(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsProofRecordRequest>,
) -> (StatusCode, Json<ApiResponse<CreatePrfsProofRecordResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &PRFS_API_ERROR_CODES.UNKNOWN_ERROR);

    let public_key = match prfs::insert_prfs_proof_record(&mut tx, &input.proof_record).await {
        Ok(p) => p,
        Err(err) => {
            let resp = ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    bail_out_tx_commit!(tx, &PRFS_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(CreatePrfsProofRecordResponse { public_key });
    return (StatusCode::OK, Json(resp));
}
