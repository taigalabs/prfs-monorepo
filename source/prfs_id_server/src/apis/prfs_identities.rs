use axum::{
    extract::{MatchedPath, Request, State},
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::{get, post},
    Json, Router,
};
use hyper::body::Incoming;
use hyper::Response;
use hyper_utils::io::{parse_req, ApiHandlerResult, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::entities::PrfsIdentity;
use prfs_entities::prfs_api::{
    PrfsIdentitySignInRequest, PrfsIdentitySignInResponse, PrfsIdentitySignUpRequest,
    PrfsIdentitySignUpResponse,
};
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODE;

pub async fn sign_up_prfs_identity(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<PrfsIdentitySignUpRequest>,
) -> (StatusCode, Json<ApiResponse<PrfsIdentitySignUpResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let prfs_identity = PrfsIdentity {
        identity_id: input.identity_id.to_string(),
        avatar_color: input.avatar_color.to_string(),
    };

    let identity_id = prfs::insert_prfs_identity(&mut tx, &prfs_identity)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.ID_ALREADY_EXISTS, err))
        .unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(PrfsIdentitySignUpResponse {
        identity_id: identity_id.to_string(),
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn sign_in_prfs_identity(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<PrfsIdentitySignInRequest>,
) -> (StatusCode, Json<ApiResponse<PrfsIdentitySignInResponse>>) {
    let pool = &state.db2.pool;
    let prfs_identity = prfs::get_prfs_identity_by_id(pool, &input.identity_id)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.CANNOT_FIND_ID, err))
        .unwrap();

    let resp = ApiResponse::new_success(PrfsIdentitySignInResponse { prfs_identity });
    return (StatusCode::OK, Json(resp));
}
