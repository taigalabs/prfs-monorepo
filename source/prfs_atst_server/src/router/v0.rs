use axum::{
    extract::{MatchedPath, Request, State},
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::{get, post},
    Json, Router,
};
use prfs_circuits_circom::CircuitBuildListJson;
use prfs_common_server_state::ServerState;
use serde_json::{json, Value};
use std::sync::Arc;
use tower_http::{cors::CorsLayer, services::ServeDir, trace::TraceLayer};
use tracing::{info, info_span, Span};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::apis::{crypto_asset, twitter};

pub const ATST_API_V0: &'static str = "/atst_api/v0";

pub fn make_atst_v0_router() -> Router<Arc<ServerState>> {
    let router = Router::new() //
        .route(
            "/fetch_crypto_asset",
            post(crypto_asset::fetch_crypto_asset),
        )
        .route(
            "/create_crypto_asset_size_atst",
            post(crypto_asset::create_crypto_asset_size_atst),
        )
        .route(
            "/get_crypto_asset_size_atsts",
            post(crypto_asset::get_crypto_asset_size_atsts),
        )
        .route(
            "/get_crypto_asset_size_atst",
            post(crypto_asset::get_crypto_asset_size_atst),
        )
        .route(
            "/compute_crypto_asset_size_total_values",
            post(crypto_asset::compute_crypto_asset_size_total_values),
        )
        .route("/validate_twitter_acc", post(twitter::validate_twitter_acc))
        .route("/attest_twitter_acc", post(twitter::attest_twitter_acc))
        .route(
            "/get_twitter_acc_atsts",
            post(twitter::get_twitter_acc_atsts),
        )
        .route("/get_twitter_acc_atst", post(twitter::get_twitter_acc_atst));

    router
}
