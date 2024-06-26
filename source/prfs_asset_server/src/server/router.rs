use prfs_axum_lib::axum::{
    extract::{Request, State},
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::get,
    Json, Router,
};
use prfs_axum_lib::tower_http::{cors::CorsLayer, services::ServeDir, trace::TraceLayer};
use prfs_circuits_circom::CircuitBuildJson;
use serde_json::{json, Value};
use std::fs;
use tracing::{info, Span};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use super::ServerState;

pub fn route() -> Router {
    let state = ServerState::init();
    let serve_dir = ServeDir::new(&state.circuits_build_path);

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                // axum logs rejections from built-in extractors with the `axum::rejection`
                // target, at `TRACE` level. `axum::rejection=trace` enables showing those events
                "prfs_asset_server=info,tower_http=info,axum::rejection=trace".into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    Router::new()
        .route("/", get(handle_server_status))
        .nest_service("/circuits", serve_dir)
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
                .allow_methods([Method::GET, Method::POST]),
        )
}

async fn handle_404() -> (StatusCode, &'static str) {
    (StatusCode::NOT_FOUND, "Not found")
}

pub async fn handle_server_status(State(state): State<ServerState>) -> (StatusCode, Json<Value>) {
    let build_json_path = state.circuits_build_path.join("build.json");
    let list_json: CircuitBuildJson =
        prfs_rust_utils::serde::read_json_file(&build_json_path).unwrap();

    let json: serde_json::Value = json!({
        "circuit_list": list_json,
        "state": state,
    });

    (StatusCode::OK, Json(json))
}
