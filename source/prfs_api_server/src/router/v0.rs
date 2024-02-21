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

use crate::apis::{prfs_accounts, prfs_circuits, prfs_proof_types};

pub fn make_v0_router() -> Router<Arc<ServerState>> {
    let router = Router::new() //
        .route(
            "/sign_up_prfs_account",
            post(prfs_accounts::sign_up_prfs_account),
        )
        .route(
            "/get_prfs_proof_types",
            post(prfs_proof_types::get_prfs_proof_types),
        )
        .route(
            "/get_prfs_proof_type_by_proof_type_id",
            post(prfs_proof_types::get_prfs_proof_type_by_proof_type_id),
        )
        .route(
            "/sign_in_prfs_account",
            post(prfs_accounts::sign_in_prfs_account),
        )
        .route("/get_prfs_circuits", post(prfs_circuits::get_prfs_circuits));

    router
}
