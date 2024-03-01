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
        CreatePrfsProofTypeRequest, CreatePrfsProofTypeResponse, GetPrfsProofRecordRequest,
        GetPrfsProofTypeByProofTypeIdRequest, GetPrfsProofTypeByProofTypeIdResponse,
        GetPrfsProofTypesRequest, GetPrfsProofTypesResponse,
    },
};
use std::sync::Arc;

// const LIMIT: i32 = 10;

pub async fn get_prfs_proof_record(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsProofRecordRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsProofTypesResponse>>) {
    let pool = &state.db2.pool;
    // let rows = prfs::get_prfs_proof_record(pool, input.offset, LIMIT).await;

    // let resp = ApiResponse::new_success(GetPrfsProofTypesResponse { next_offset, rows });
    // return (StatusCode::OK, Json(resp));
    unreachable!()
}

pub async fn create_prfs_proof_record(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsProofTypeRequest>,
) -> (StatusCode, Json<ApiResponse<CreatePrfsProofTypeResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    unreachable!();

    // let prfs_proof_type = PrfsProofType {
    //     proof_type_id: input.proof_type_id,
    //     label: input.label.to_string(),
    //     author: input.author.to_string(),
    //     desc: input.desc.to_string(),
    //     expression: input.expression.to_string(),
    //     img_url: input.img_url,
    //     img_caption: input.img_caption,
    //     circuit_id: input.circuit_id,
    //     circuit_type_id: input.circuit_type_id,
    //     circuit_type_data: input.circuit_type_data,
    //     circuit_driver_id: input.circuit_driver_id,
    //     created_at: chrono::offset::Utc::now(),
    // };

    // let id = prfs::insert_prfs_proof_type(&mut tx, &prfs_proof_type).await;

    // tx.commit().await.unwrap();

    // let resp = ApiResponse::new_success(CreatePrfsProofTypeResponse { id });
    // return (StatusCode::OK, Json(resp));
}