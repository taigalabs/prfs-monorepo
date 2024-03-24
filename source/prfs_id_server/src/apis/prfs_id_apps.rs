use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::id_api::{
    SignInPrfsIdentityRequest, SignInPrfsIdentityResponse, SignUpPrfsIdentityRequest,
    SignUpPrfsIdentityResponse,
};
use prfs_entities::id_entities::{PrfsIdentity, PrfsIdentityType};
use prfs_id_api_error_codes::PRFS_ID_API_ERROR_CODES;
use std::sync::Arc;

pub async fn get_prfs_id_app(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<SignUpPrfsIdentityRequest>,
) -> (StatusCode, Json<ApiResponse<SignUpPrfsIdentityResponse>>) {
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
        public_key: input.public_key.to_string(),
        identity_type: PrfsIdentityType::SECP_256K1,
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

    let resp = ApiResponse::new_success(SignUpPrfsIdentityResponse {
        identity_id: identity_id.to_string(),
    });
    return (StatusCode::OK, Json(resp));
}
