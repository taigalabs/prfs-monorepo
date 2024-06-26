use prfs_api_error_codes::PRFS_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
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
    let rows = match prfs::get_prfs_proof_types(
        pool,
        input.experimental.unwrap_or(false),
        input.offset,
        LIMIT,
    )
    .await
    {
        Ok(r) => r,
        Err(err) => {
            let resp = ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

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
        match prfs::get_prfs_proof_type_by_proof_type_id(pool, &input.proof_type_id).await {
            Ok(p) => p,
            Err(err) => {
                let resp =
                    ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };

    let resp = ApiResponse::new_success(GetPrfsProofTypeByProofTypeIdResponse { prfs_proof_type });
    return (StatusCode::OK, Json(resp));
}

pub async fn create_prfs_proof_type(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsProofTypeRequest>,
) -> (StatusCode, Json<ApiResponse<CreatePrfsProofTypeResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &PRFS_API_ERROR_CODES.UNKNOWN_ERROR);

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
        experimental: input.experimental,
        created_at: chrono::offset::Utc::now(),
    };

    let id = match prfs::insert_prfs_proof_type(&mut tx, &prfs_proof_type).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    bail_out_tx_commit!(tx, &PRFS_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(CreatePrfsProofTypeResponse { id });
    return (StatusCode::OK, Json(resp));
}
