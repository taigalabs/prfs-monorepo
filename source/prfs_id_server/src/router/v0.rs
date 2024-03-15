use prfs_axum_lib::axum::{routing::post, Router};
use prfs_common_server_state::ServerState;
use prfs_id_api_error_codes::bindgen::make_prfs_id_api_error_code_json_binding;
use std::sync::Arc;

use crate::apis::prfs_identities;

pub const ID_API_V0: &'static str = "/id_api/v0";

pub fn make_id_v0_router() -> Router<Arc<ServerState>> {
    make_prfs_id_api_error_code_json_binding().unwrap();

    let router = Router::new() //
        .route(
            "/sign_up_prfs_identity",
            post(prfs_identities::sign_up_prfs_identity),
        )
        .route(
            "/sign_in_prfs_identity",
            post(prfs_identities::sign_in_prfs_identity),
        );

    router
}
