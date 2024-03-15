use prfs_axum_lib::axum::extract::State;
use prfs_axum_lib::axum::{http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_entities::entities::PrfsAccount;
use shy_api_error_codes::SHY_API_ERROR_CODES;
use shy_db_interface::shy;
use shy_entities::entities::ShyAccount;
use shy_entities::shy_api::{
    SignInShyAccountRequest, SignInShyAccountResponse, SignUpShyAccountRequest,
    SignUpShyAccountResponse,
};
use std::sync::Arc;

pub async fn sign_up_shy_account(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<SignUpShyAccountRequest>,
) -> (StatusCode, Json<ApiResponse<SignUpShyAccountResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let account = ShyAccount {
        account_id: input.account_id.to_string(),
        public_key: input.public_key.to_string(),
        avatar_color: input.avatar_color.to_string(),
        policy_ids: JsonType(vec![]),
    };

    let account_id = match shy::insert_shy_account(&mut tx, &account).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Error inserting proof account, err: {:?}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(SignUpShyAccountResponse {
        account_id: account_id.to_string(),
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn sign_in_shy_account(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<SignInShyAccountRequest>,
) -> (StatusCode, Json<ApiResponse<SignInShyAccountResponse>>) {
    let pool = &state.db2.pool;
    let shy_account = match shy::get_shy_account_by_account_id(pool, &input.account_id).await {
        Ok(i) => i,
        Err(_) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.CANNOT_FIND_USER,
                format!("account_id: {}", input.account_id),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(SignInShyAccountResponse { shy_account });
    return (StatusCode::OK, Json(resp));
}
