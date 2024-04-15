use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use shy_api_error_codes::SHY_API_ERROR_CODES;
use shy_db_interface::shy;
use shy_entities::{GetShyProofsRequest, GetShyProofsResponse};
use std::sync::Arc;

const LIMIT: i32 = 15;

pub async fn get_shy_proofs(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyProofsRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyProofsResponse>>) {
    let pool = &state.db2.pool;
    let shy_proofs = match shy::get_shy_proofs(pool, &input.public_key).await {
        Ok(t) => t,
        Err(err) => {
            let resp = ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetShyProofsResponse { shy_proofs });
    return (StatusCode::OK, Json(resp));
}
