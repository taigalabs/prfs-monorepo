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

pub const ATST_API_V0: &'static str = "/atst_api";

pub fn make_atst_v0_router() -> Router<Arc<ServerState>> {
    let router = Router::new(); //
                                // .route(
                                //     "/sign_up_prfs_account",
                                //     post(prfs_accounts::sign_up_prfs_account),
                                // )
                                // .route(
                                //     "/get_prfs_proof_types",
                                //     post(prfs_proof_types::get_prfs_proof_types),
                                // )
                                // .route(
                                //     "/get_prfs_proof_type_by_proof_type_id",
                                //     post(prfs_proof_types::get_prfs_proof_type_by_proof_type_id),
                                // )
                                // .route(
                                //     "/sign_in_prfs_account",
                                //     post(prfs_accounts::sign_in_prfs_account),
                                // )
                                // .route("/get_prfs_circuits", post(prfs_circuits::get_prfs_circuits))
                                // .route(
                                //     "/get_prfs_circuit_by_circuit_id",
                                //     post(prfs_circuits::get_prfs_circuit_by_circuit_id),
                                // )
                                // .route(
                                //     "/get_prfs_circuit_types",
                                //     post(prfs_circuit_types::get_prfs_circuit_types),
                                // )
                                // .route(
                                //     "/get_prfs_circuit_type_by_circuit_type_id",
                                //     post(prfs_circuit_types::get_prfs_circuit_type_by_circuit_type_id),
                                // )
                                // .route(
                                //     "/get_prfs_circuit_drivers",
                                //     post(prfs_circuit_drivers::get_prfs_circuit_drivers),
                                // )
                                // .route(
                                //     "/get_prfs_circuit_driver_by_driver_id",
                                //     post(prfs_circuit_drivers::get_prfs_circuit_driver_by_driver_id),
                                // )
                                // .route(
                                //     "/create_prfs_proof_instance",
                                //     post(prfs_proof_instances::create_prfs_proof_instance),
                                // )
                                // .route(
                                //     "/get_prfs_proof_instances",
                                //     post(prfs_proof_instances::get_prfs_proof_instances),
                                // )
                                // .route(
                                //     "/get_prfs_proof_instance_by_instance_id",
                                //     post(prfs_proof_instances::get_prfs_proof_instance_by_instance_id),
                                // )
                                // .route(
                                //     "/get_prfs_proof_instance_by_short_id",
                                //     post(prfs_proof_instances::get_prfs_proof_instance_by_short_id),
                                // )
                                // .route(
                                //     "/get_prfs_set_elements",
                                //     post(prfs_set_elements::get_prfs_set_elements),
                                // )
                                // .route(
                                //     "/get_prfs_set_element",
                                //     post(prfs_set_elements::get_prfs_set_element),
                                // )
                                // .route(
                                //     "/get_prfs_tree_nodes_by_pos",
                                //     post(prfs_tree_nodes::get_prfs_tree_nodes_by_pos),
                                // )
                                // .route(
                                //     "/get_prfs_tree_leaf_nodes_by_set_id",
                                //     post(prfs_tree_nodes::get_prfs_tree_leaf_nodes_by_set_id),
                                // )
                                // .route(
                                //     "/get_prfs_tree_leaf_indices",
                                //     post(prfs_tree_nodes::get_prfs_tree_leaf_indices),
                                // )
                                // .route("/create_prfs_set", post(prfs_sets::create_prfs_set))
                                // .route("/get_prfs_sets", post(prfs_sets::get_prfs_sets))
                                // .route(
                                //     "/get_prfs_sets_by_set_type",
                                //     post(prfs_sets::get_prfs_sets_by_set_type),
                                // )
                                // .route(
                                //     "/get_prfs_set_by_set_id",
                                //     post(prfs_sets::get_prfs_set_by_set_id),
                                // )
                                // .route(
                                //     "/create_prfs_proof_type",
                                //     post(prfs_proof_types::create_prfs_proof_type),
                                // )
                                // .route(
                                //     "/update_prfs_tree_node",
                                //     post(prfs_tree_nodes::update_prfs_tree_node),
                                // )
                                // .route("/get_prfs_polls", post(prfs_polls::get_prfs_polls))
                                // .route(
                                //     "/get_prfs_poll_by_poll_id",
                                //     post(prfs_polls::get_prfs_poll_by_poll_id),
                                // )
                                // .route(
                                //     "/get_prfs_poll_result_by_poll_id",
                                //     post(prfs_polls::get_prfs_poll_result_by_poll_id),
                                // )
                                // .route(
                                //     "/submit_prfs_poll_response",
                                //     post(prfs_polls::submit_prfs_poll_response),
                                // )
                                // .route("/create_prfs_poll", post(prfs_polls::create_prfs_poll))
                                // .route(
                                //     "/import_prfs_set_elements",
                                //     post(prfs_set_elements::import_prfs_set_elements),
                                // )
                                // .route(
                                //     "/create_prfs_tree_by_prfs_set",
                                //     post(prfs_trees::create_prfs_tree_by_prfs_set),
                                // )
                                // .route(
                                //     "/get_latest_prfs_tree_by_set_id",
                                //     post(prfs_trees::get_latest_prfs_tree_by_set_id),
                                // )
                                // .route(
                                //     "/get_least_recent_index",
                                //     post(prfs_indices::get_least_recent_index),
                                // )
                                // .route("/get_prfs_indices", post(prfs_indices::get_prfs_indices))
                                // .route("/add_prfs_index", post(prfs_indices::add_prfs_index));

    router
}
