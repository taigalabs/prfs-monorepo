use prfs_axum_lib::axum::extract::{State, WebSocketUpgrade};
use prfs_axum_lib::axum::http::StatusCode;
use prfs_axum_lib::axum::Json;
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::id_session::PrfsIdSession;
use prfs_entities::{OpenPrfsIdSession2Request, OpenPrfsIdSession2Response};
use prfs_id_session_api_error_codes::PRFS_ID_SESSION_API_ERROR_CODES;
use std::sync::Arc;

pub async fn open_prfs_id_session2(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<OpenPrfsIdSession2Request>,
) -> (StatusCode, Json<ApiResponse<OpenPrfsIdSession2Response>>) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &PRFS_ID_SESSION_API_ERROR_CODES.UNKNOWN_ERROR);

    let session = PrfsIdSession {
        key: input.key,
        value: input.value.unwrap_or(vec![]),
        ticket: input.ticket,
    };

    let key = match prfs::upsert_prfs_id_session(&mut tx, &session).await {
        Ok(k) => k,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_ID_SESSION_API_ERROR_CODES.SESSION_NOT_EXISTS,
                err.to_string(),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    bail_out_tx_commit!(tx, &PRFS_ID_SESSION_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(OpenPrfsIdSession2Response {
        key: key.to_string(),
    });
    return (StatusCode::OK, Json(resp));
}
