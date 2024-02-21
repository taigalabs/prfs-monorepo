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
use tower_http::{
    cors::{Any, CorsLayer},
    services::ServeDir,
    trace::TraceLayer,
};
use tracing::{info, info_span, Span};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use super::v0::make_v0_router;

const API_V0: &str = "/api/v0/";

pub fn route(state: Arc<ServerState>) -> Router {
    Router::new()
        .route("/", get(handle_server_status))
        .nest(API_V0, make_v0_router())
        // .nest_service("/circuits", serve_dir)
        .with_state(state)
        .fallback_service(handle_404.into_service())
        .layer(
            TraceLayer::new_for_http().on_request(|request: &Request<_>, _span: &Span| {
                info!("{} - {}", request.method(), request.uri());
            }),
        )
        .layer(
            CorsLayer::new()
                .allow_origin("*".parse::<HeaderValue>().unwrap())
                .allow_headers(Any)
                .allow_methods([Method::GET, Method::POST]),
        )
}

async fn handle_404() -> (StatusCode, &'static str) {
    (StatusCode::NOT_FOUND, "Not found")
}

pub async fn handle_server_status(
    State(state): State<Arc<ServerState>>,
) -> (StatusCode, Json<Value>) {
    let json = serde_json::json!({
        "commit_hash": state.commit_hash.to_string(),
        "launch_time": state.launch_time.to_string(),
    });

    (StatusCode::OK, Json(json))
}
