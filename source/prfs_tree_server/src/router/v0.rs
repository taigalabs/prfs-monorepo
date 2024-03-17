use prfs_axum_lib::axum::{routing::post, Router};
use prfs_common_server_state::ServerState;
// use shy_api_error_codes::bindgen::make_shy_api_error_code_json_binding;
use std::sync::Arc;

// use crate::apis::{accounts, channels, posts, topic_proofs, topics};

pub const TREE_API_V0: &'static str = "/tree_api/v0";

pub fn make_tree_api_v0_router() -> Router<Arc<ServerState>> {
    // Adding a side effect until this server runs standalone
    // make_shy_api_error_code_json_binding().unwrap();

    let router = Router::new().route(
        "/update_prfs_tree_by_new_atst",
        post(topics::create_shy_topic),
    );
    // .route("/create_shy_post", post(posts::create_shy_post))

    router
}
