use axum::{
    extract::{MatchedPath, Request, State},
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::get,
    Json, Router,
};
use prfs_circuits_circom::CircuitBuildListJson;
use prfs_common_server_state::ServerState;
use serde_json::{json, Value};
use std::sync::Arc;
use tower_http::{cors::CorsLayer, services::ServeDir, trace::TraceLayer};
use tracing::{info, info_span, Span};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

pub fn make_v0_router() -> Router<Arc<ServerState>> {
    let router = Router::new().route("/sign_up_prfs_account", get(|| async { return "1" }));
    router
}
