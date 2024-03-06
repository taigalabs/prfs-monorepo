use prfs_axum_lib::axum::{routing::post, Router};
use prfs_common_server_state::ServerState;
use std::sync::Arc;

use crate::apis::{channels, posts};

pub const SHY_API_V0: &'static str = "/shy_api/v0";

pub fn make_shy_v0_router() -> Router<Arc<ServerState>> {
    let router = Router::new() //
        .route("/create_shy_topic", post(posts::create_shy_post))
        .route("/get_shy_topics", post(posts::get_shy_posts))
        .route("/get_shy_topic", post(posts::get_shy_post))
        .route("/get_shy_channels", post(channels::get_shy_channels))
        .route("/get_shy_channel", post(channels::get_shy_channel));

    router
}
