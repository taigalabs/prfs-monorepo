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

use crate::apis::{session, session_val};

pub const ATST_API_V0: &'static str = "/atst_api/v0";

pub fn make_atst_v0_router() -> Router<Arc<ServerState>> {
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
