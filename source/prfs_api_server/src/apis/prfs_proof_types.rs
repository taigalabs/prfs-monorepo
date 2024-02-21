use axum::{
    extract::{MatchedPath, Request, State},
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::{get, post},
    Json, Router,
};
use hyper::{body::Incoming, Response};
use hyper_utils::{
    io::{parse_req, ApiHandlerResult, BytesBoxBody},
    resp::ApiResponse,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    entities::PrfsProofType,
    prfs_api::{
        CreatePrfsProofTypeRequest, CreatePrfsProofTypeResponse,
        GetPrfsProofTypeByProofTypeIdRequest, GetPrfsProofTypeByProofTypeIdResponse,
        GetPrfsProofTypesRequest, GetPrfsProofTypesResponse,
    },
};
use std::sync::Arc;

const LIMIT: i32 = 10;

pub async fn get_prfs_proof_types(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsProofTypesRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsProofTypesResponse>>) {
    let pool = &state.db2.pool;
    let rows = prfs::get_prfs_proof_types(pool, input.offset, LIMIT).await;

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetPrfsProofTypesResponse { next_offset, rows });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_proof_type_by_proof_type_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsProofTypeByProofTypeIdRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<GetPrfsProofTypeByProofTypeIdResponse>>,
) {
    let pool = &state.db2.pool;
    let prfs_proof_type =
        prfs::get_prfs_proof_type_by_proof_type_id(pool, &input.proof_type_id).await;

    let resp = ApiResponse::new_success(GetPrfsProofTypeByProofTypeIdResponse { prfs_proof_type });
    return (StatusCode::OK, Json(resp));
}

pub async fn create_prfs_proof_type(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsProofTypeRequest>,
) -> (StatusCode, Json<ApiResponse<CreatePrfsProofTypeResponse>>) {
    // let req: CreatePrfsProofTypeRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let prfs_proof_type = PrfsProofType {
        proof_type_id: input.proof_type_id,
        label: input.label.to_string(),
        author: input.author.to_string(),
        desc: input.desc.to_string(),
        expression: input.expression.to_string(),
        img_url: input.img_url,
        img_caption: input.img_caption,
        circuit_id: input.circuit_id,
        circuit_type_id: input.circuit_type_id,
        circuit_type_data: input.circuit_type_data,
        circuit_driver_id: input.circuit_driver_id,
        created_at: chrono::offset::Utc::now(),
    };

    let id = prfs::insert_prfs_proof_type(&mut tx, &prfs_proof_type).await;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsProofTypeResponse { id });
    return (StatusCode::OK, Json(resp));
}
