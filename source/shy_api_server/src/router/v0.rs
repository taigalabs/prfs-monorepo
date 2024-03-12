use prfs_axum_lib::axum::{routing::post, Router};
use prfs_common_server_state::ServerState;
use shy_api_error_codes::bindgen::make_shy_api_error_code_json_binding;
use std::sync::Arc;

use crate::apis::{channels, posts, topic_proofs, topics};

pub const SHY_API_V0: &'static str = "/shy_api/v0";

pub fn make_shy_v0_router() -> Router<Arc<ServerState>> {
    // Adding a side effect until this server runs standalone
    make_shy_api_error_code_json_binding().unwrap();

    let router = Router::new() //
        .route("/create_shy_topic", post(topics::create_shy_topic))
        .route("/create_shy_post", post(posts::create_shy_post))
        .route("/get_shy_topics", post(topics::get_shy_topics))
        .route("/get_shy_topic", post(topics::get_shy_topic))
        .route(
            "/get_shy_topic_proof",
            post(topic_proofs::get_shy_topic_proof),
        )
        .route(
            "/get_shy_posts_of_topic",
            post(posts::get_shy_posts_of_topic),
        )
        .route("/get_shy_channels", post(channels::get_shy_channels))
        .route("/get_shy_channel", post(channels::get_shy_channel));

    router
}
