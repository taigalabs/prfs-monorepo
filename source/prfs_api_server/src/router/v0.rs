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

use crate::apis::{
    prfs_accounts, prfs_circuit_drivers, prfs_circuit_types, prfs_circuits, prfs_proof_instances,
    prfs_proof_types, prfs_set_elements,
};

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
        .route("/get_prfs_circuits", post(prfs_circuits::get_prfs_circuits))
        .route(
            "/get_prfs_circuit_by_circuit_id",
            post(prfs_circuits::get_prfs_circuit_by_circuit_id),
        )
        .route(
            "/get_prfs_circuit_types",
            post(prfs_circuit_types::get_prfs_circuit_types),
        )
        .route(
            "/get_prfs_circuit_type_by_circuit_type_id",
            post(prfs_circuit_types::get_prfs_circuit_type_by_circuit_type_id),
        )
        .route(
            "/get_prfs_circuit_drivers",
            post(prfs_circuit_drivers::get_prfs_circuit_drivers),
        )
        .route(
            "/get_prfs_circuit_driver_by_driver_id",
            post(prfs_circuit_drivers::get_prfs_circuit_driver_by_driver_id),
        )
        .route(
            "/create_prfs_proof_instance",
            post(prfs_proof_instances::create_prfs_proof_instance),
        )
        .route(
            "/get_prfs_proof_instances",
            post(prfs_proof_instances::get_prfs_proof_instances),
        )
        .route(
            "/get_prfs_proof_instance_by_instance_id",
            post(prfs_proof_instances::get_prfs_proof_instance_by_instance_id),
        )
        .route(
            "/get_prfs_proof_instance_by_short_id",
            post(prfs_proof_instances::get_prfs_proof_instance_by_short_id),
        )
        .route(
            "/get_prfs_set_elements",
            post(prfs_set_elements::get_prfs_set_elements),
        );

    router
}
