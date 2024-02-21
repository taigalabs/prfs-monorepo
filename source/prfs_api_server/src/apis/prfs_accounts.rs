use axum::extract::State;
use axum::{
    http::{HeaderValue, Method, StatusCode},
    Json,
};
use hyper::body::Incoming;
use hyper::Request;
use hyper_utils::io::{parse_req, ApiHandlerResult};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    entities::PrfsAccount,
    id_api::{PrfsSignInRequest, PrfsSignInResponse, PrfsSignUpRequest, PrfsSignUpResponse},
    sqlx::types::Json as JsonType,
};
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODES;

pub async fn sign_up_prfs_account(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<PrfsSignUpRequest>,
) -> (StatusCode, Json<ApiResponse<PrfsSignUpResponse>>) {
    // let req: PrfsSignUpRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let prfs_account = PrfsAccount {
        account_id: input.account_id.to_string(),
        public_key: input.public_key.to_string(),
        avatar_color: input.avatar_color.to_string(),
        policy_ids: JsonType::from(vec![]),
    };

    let account_id = prfs::insert_prfs_account(&mut tx, &prfs_account)
        .await
        .map_err(|err| {
            ApiHandleError::from(
                &API_ERROR_CODES.USER_ALREADY_EXISTS,
                format!("account_id: {}, err: {}", input.account_id, err).into(),
            )
        })
        .unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(PrfsSignUpResponse {
        account_id: account_id.to_string(),
    });
    // return Ok(resp.into_hyper_response());

    return (StatusCode::OK, Json(resp));
}

pub async fn sign_in_prfs_account(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: PrfsSignInRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_account = prfs::get_prfs_account_by_account_id(pool, &req.account_id)
        .await
        .map_err(|_err| {
            hyper_utils::ApiHandleError::from(
                &API_ERROR_CODES.CANNOT_FIND_USER,
                req.account_id.into(),
            )
        })?;

    let resp = ApiResponse::new_success(PrfsSignInResponse { prfs_account });

    return Ok(resp.into_hyper_response());
}
