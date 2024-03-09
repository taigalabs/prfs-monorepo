use prfs_axum_lib::axum::{
    routing::{get, post},
    Router,
};
use prfs_common_server_state::ServerState;
use prfs_id_session_api_error_codes::error_codes::bindgen::make_prfs_id_session_api_error_code_json_binding;
use std::sync::Arc;

use crate::apis::{session, session_val};

pub const ID_SESSION_API_V0: &'static str = "/id_session_api/v0";

pub fn make_id_session_v0_router() -> Router<Arc<ServerState>> {
    // Adding a side effect until this server runs standalone
    make_prfs_id_session_api_error_code_json_binding().unwrap();

    let router = Router::new() //
        .route("/open_prfs_id_session", get(session::open_prfs_id_session))
        .route(
            "/put_prfs_id_session_value",
            post(session_val::put_prfs_id_session_value),
        )
        .route(
            "/get_prfs_id_session_value",
            post(session_val::get_prfs_id_session_value),
        );

    router
}
