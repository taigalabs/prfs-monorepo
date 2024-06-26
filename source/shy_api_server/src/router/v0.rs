use prfs_axum_lib::axum::{routing::post, Router};
use prfs_common_server_state::ServerState;
use shy_api_error_codes::bindgen::make_shy_api_error_code_json_binding;
use std::sync::Arc;

use crate::{
    apis::{accounts, channels, comments, shy_proofs, topics},
    envs::ENVS,
};

pub const SHY_API_V0: &'static str = "/shy_api/v0";

pub fn make_shy_v0_router() -> Router<Arc<ServerState>> {
    // Adding a side effect until this server runs standalone
    make_shy_api_error_code_json_binding().unwrap();
    ENVS.check();

    let router = Router::new() //
        .route("/create_shy_topic", post(topics::create_shy_topic))
        .route("/create_shy_comment", post(comments::create_shy_comment))
        .route(
            "/create_shy_comment_with_proofs",
            post(comments::create_shy_comment_with_proofs),
        )
        .route("/join_shy_channel", post(channels::join_shy_channel))
        .route("/sign_in_shy_account", post(accounts::sign_in_shy_account))
        .route("/sign_up_shy_account", post(accounts::sign_up_shy_account))
        .route("/get_shy_topics", post(topics::get_shy_topics))
        .route("/get_shy_topic", post(topics::get_shy_topic))
        .route("/get_shy_proofs", post(shy_proofs::get_shy_proofs))
        .route(
            "/get_shy_comments_of_topic",
            post(comments::get_shy_comments_of_topic),
        )
        .route("/get_shy_channels", post(channels::get_shy_channels))
        .route("/get_shy_channel", post(channels::get_shy_channel));

    router
}
