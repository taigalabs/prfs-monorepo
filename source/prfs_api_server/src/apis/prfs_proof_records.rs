use axum::{
    extract::State,
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use prfs_axum_lib::{
    io::{parse_req, ApiHandlerResult, BytesBoxBody},
    resp::ApiResponse,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    entities::PrfsProofType,
    prfs_api::{
        CreatePrfsProofRecordRequest, CreatePrfsProofRecordResponse, CreatePrfsProofTypeRequest,
        CreatePrfsProofTypeResponse, GetPrfsProofRecordRequest, GetPrfsProofRecordResponse,
        GetPrfsProofTypeByProofTypeIdRequest, GetPrfsProofTypeByProofTypeIdResponse,
        GetPrfsProofTypesRequest, GetPrfsProofTypesResponse,
    },
};
use std::sync::Arc;

// const LIMIT: i32 = 10;

pub async fn get_prfs_proof_record(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsProofRecordRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsProofRecordResponse>>) {
    let pool = &state.db2.pool;
    // let rows = prfs::get_prfs_proof_record(pool, input.offset, LIMIT).await;

    // let resp = ApiResponse::new_success(GetPrfsProofTypesResponse { next_offset, rows });
    // return (StatusCode::OK, Json(resp));
    unreachable!()
}

pub async fn create_prfs_proof_record(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsProofRecordRequest>,
) -> (StatusCode, Json<ApiResponse<CreatePrfsProofRecordResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let public_key = prfs::insert_prfs_proof_record(&mut tx, &input.proof_record).await;
    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsProofRecordResponse { public_key });
    return (StatusCode::OK, Json(resp));
}
