use axum::{
    extract::State,
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::get,
    Json, Router,
};
use tower_http::{cors::CorsLayer, services::ServeDir};

use super::ServerState;
use crate::paths::PATHS;

pub fn route() -> Router {
    let state = ServerState {
        status: "Ok".to_string(),
    };
    let serve_dir = ServeDir::new(&PATHS.assets);

    Router::new()
        .route("/", get(handle_server_state))
        .nest_service("/assets", serve_dir)
        .with_state(state)
        .fallback_service(handle_404.into_service())
        .layer(
            CorsLayer::new()
                .allow_origin("*".parse::<HeaderValue>().unwrap())
                .allow_methods([Method::GET, Method::POST]),
        )
}

async fn handle_404() -> (StatusCode, &'static str) {
    (StatusCode::NOT_FOUND, "Not found")
}

pub async fn handle_server_state(
    State(_state): State<ServerState>,
) -> (StatusCode, Json<ServerState>) {
    (
        StatusCode::OK,
        Json(ServerState {
            status: "Ok".to_string(),
        }),
    )
}
