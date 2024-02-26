use axum::{
    extract::{MatchedPath, Request, State},
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::{get, post},
    Json, Router,
};
use hyper::body::Incoming;
use hyper::Response;
use prfs_axum_lib::error::ApiHandleError;
use prfs_axum_lib::io::{parse_req, BytesBoxBody};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::entities::PrfsIdSession;
use prfs_entities::id_session_api::{
    GetPrfsIdSessionValueRequest, GetPrfsIdSessionValueResponse, PutPrfsIdSessionValueRequest,
    PutPrfsIdSessionValueResponse,
};
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODE;

pub async fn get_prfs_id_session_value(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsIdSessionValueRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsIdSessionValueResponse>>) {
    let pool = &state.db2.pool;

    let session = prfs::get_prfs_id_session(&pool, &input.key)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsIdSessionValueResponse { session });
    return (StatusCode::OK, Json(resp));
}

pub async fn put_prfs_id_session_value(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<PutPrfsIdSessionValueRequest>,
) -> (StatusCode, Json<ApiResponse<PutPrfsIdSessionValueResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let _old_session = prfs::get_prfs_id_session(&pool, &input.key)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))
        //
        .unwrap2();

    let session = PrfsIdSession {
        key: input.key.to_string(),
        value: input.value,
        ticket: input.ticket,
    };

    let key = prfs::upsert_prfs_id_session(&mut tx, &session)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))
        .unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(PutPrfsIdSessionValueResponse { key });
    return (StatusCode::OK, Json(resp));
}
