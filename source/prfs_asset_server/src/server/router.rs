use axum::{
    extract::{MatchedPath, Request, State},
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::get,
    Json, Router,
};
use prfs_circuits_circom::CircuitBuildListJson;
use serde_json::{json, Value};
use std::fs;
use tower_http::{cors::CorsLayer, services::ServeDir, trace::TraceLayer};
use tracing::{info_span, Span};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use super::ServerState;

pub fn route() -> Router {
    let state = ServerState::init();
    let serve_dir = ServeDir::new(&state.circuits_build_path);

    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    Router::new()
        .route("/", get(handle_server_status))
        .nest_service("/assets", serve_dir)
        .with_state(state)
        .fallback_service(handle_404.into_service())
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(|request: &Request<_>| {
                    // Log the matched route's path (with placeholders not filled in).
                    // Use request.uri() or OriginalUri if you want the real path.
                    let matched_path = request
                        .extensions()
                        .get::<MatchedPath>()
                        .map(MatchedPath::as_str);

                    info_span!(
                        "http_request",
                        method = ?request.method(),
                        matched_path,
                        some_other_field = tracing::field::Empty,
                    )
                })
                .on_request(|_request: &Request<_>, span: &Span| {
                    span.record("power", 1);
                }),
        )
        .layer(
            CorsLayer::new()
                .allow_origin("*".parse::<HeaderValue>().unwrap())
                .allow_methods([Method::GET, Method::POST]),
        )
}

async fn handle_404() -> (StatusCode, &'static str) {
    (StatusCode::NOT_FOUND, "Not found")
}

pub async fn handle_server_status(State(state): State<ServerState>) -> (StatusCode, Json<Value>) {
    let list_json_path = state.circuits_build_path.join("list.json");
    let b = fs::read(&list_json_path)
        .expect(&format!("list.json not found, path: {:?}", list_json_path));

    let list_json: CircuitBuildListJson = serde_json::from_slice(&b).unwrap();

    let json: serde_json::Value = json!({
        "circuit_built_at": list_json.timestamp,
        "state": state,
    });

    (StatusCode::OK, Json(json))
}
