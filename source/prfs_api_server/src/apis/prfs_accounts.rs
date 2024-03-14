use prfs_api_error_codes::PRFS_API_ERROR_CODES;
use prfs_axum_lib::axum::extract::State;
use prfs_axum_lib::axum::{http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_db_interface::prfs;
use prfs_entities::{
    entities::PrfsAccount,
    id_api::{PrfsSignInRequest, PrfsSignInResponse, PrfsSignUpRequest, PrfsSignUpResponse},
};
use std::sync::Arc;

pub async fn sign_up_prfs_account(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<PrfsSignUpRequest>,
) -> (StatusCode, Json<ApiResponse<PrfsSignUpResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let prfs_account = PrfsAccount {
        account_id: input.account_id.to_string(),
        public_key: input.public_key.to_string(),
        avatar_color: input.avatar_color.to_string(),
        policy_ids: JsonType::from(vec![]),
    };

    let account_id = match prfs::insert_prfs_account(&mut tx, &prfs_account).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Error inserting proof account, err: {:?}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(PrfsSignUpResponse {
        account_id: account_id.to_string(),
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn sign_in_prfs_account(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<PrfsSignInRequest>,
) -> (StatusCode, Json<ApiResponse<PrfsSignInResponse>>) {
    let pool = &state.db2.pool;
    let prfs_account = match prfs::get_prfs_account_by_account_id(pool, &input.account_id).await {
        Ok(i) => i,
        Err(_) => {
            let resp = ApiResponse::new_error(
                &PRFS_API_ERROR_CODES.CANNOT_FIND_USER,
                format!("account_id: {}", input.account_id),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(PrfsSignInResponse { prfs_account });
    return (StatusCode::OK, Json(resp));
}
