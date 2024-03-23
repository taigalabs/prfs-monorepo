use prfs_atst_server::router::v0::{make_atst_v0_router, ATST_API_V0};
use prfs_axum_lib::axum::{
    extract::Request,
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::get,
    Router,
};
use prfs_axum_lib::tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};
use prfs_common_server_state::ServerState;
use prfs_id_server::router::v0::{make_id_api_v0_router, ID_API_V0};
use prfs_id_session_server::router::v0::{make_id_session_v0_router, ID_SESSION_API_V0};
use prfs_tree_server::router::v0::{make_tree_api_v0_router, TREE_API_V0};
use shy_api_server::router::v0::{make_shy_v0_router, SHY_API_V0};
use std::sync::Arc;
use tracing::{info, Span};

use super::v0::make_api_v0_router;
use crate::apis::server_status::handle_server_status;

const API_V0: &str = "/api/v0/";

pub async fn route(state: Arc<ServerState>) -> Router {
    Router::new()
        .route("/", get(handle_server_status))
        .route("/status", get(handle_server_status))
        .nest(API_V0, make_api_v0_router())
        .nest(ATST_API_V0, make_atst_v0_router())
        .nest(TREE_API_V0, make_tree_api_v0_router().await)
        .nest(ID_API_V0, make_id_api_v0_router())
        .nest(ID_SESSION_API_V0, make_id_session_v0_router())
        .nest(SHY_API_V0, make_shy_v0_router())
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
