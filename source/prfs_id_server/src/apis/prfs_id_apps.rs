use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::id_api::{
    SignInPrfsIdentityRequest, SignInPrfsIdentityResponse, SignUpPrfsIdentityRequest,
    SignUpPrfsIdentityResponse,
};
use prfs_entities::id_entities::{PrfsIdentity, PrfsIdentityType};
use prfs_entities::{GetPrfsIdAppRequest, GetPrfsIdAppResponse};
use prfs_id_api_error_codes::PRFS_ID_API_ERROR_CODES;
use std::sync::Arc;

pub async fn get_prfs_id_app(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsIdAppRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsIdAppResponse>>) {
    let pool = &state.db2.pool;

    let prfs_id_app = match prfs::get_prfs_id_app(&pool, &input.app_id).await {
        Ok(i) => i,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_ID_API_ERROR_CODES.ID_ALREADY_EXISTS, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetPrfsIdAppResponse { prfs_id_app });
    return (StatusCode::OK, Json(resp));
}
