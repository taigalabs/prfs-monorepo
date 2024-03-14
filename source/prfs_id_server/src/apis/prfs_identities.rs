use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::entities::PrfsIdentity;
use prfs_entities::prfs_api::{
    PrfsIdentitySignInRequest, PrfsIdentitySignInResponse, PrfsIdentitySignUpRequest,
    PrfsIdentitySignUpResponse,
};
use prfs_id_api_error_codes::PRFS_ID_API_ERROR_CODES;
use std::sync::Arc;

pub async fn sign_up_prfs_identity(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<PrfsIdentitySignUpRequest>,
) -> (StatusCode, Json<ApiResponse<PrfsIdentitySignUpResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = match pool.begin().await {
        Ok(t) => t,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_ID_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("error starting db transaction: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let prfs_identity = PrfsIdentity {
        identity_id: input.identity_id.to_string(),
        avatar_color: input.avatar_color.to_string(),
    };

    let identity_id = match prfs::insert_prfs_identity(&mut tx, &prfs_identity).await {
        Ok(i) => i,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_ID_API_ERROR_CODES.ID_ALREADY_EXISTS, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

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
    let prfs_identity = match prfs::get_prfs_identity_by_id(pool, &input.identity_id).await {
        Ok(i) => i,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_ID_API_ERROR_CODES.CANNOT_FIND_ID, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(PrfsIdentitySignInResponse { prfs_identity });
    return (StatusCode::OK, Json(resp));
}
