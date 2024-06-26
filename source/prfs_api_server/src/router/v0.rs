use prfs_api_error_codes::error_codes::bindgen::make_prfs_api_error_code_json_binding;
use prfs_axum_lib::axum::{routing::post, Router};
use prfs_common_server_state::ServerState;
use std::sync::Arc;

use crate::apis::{
    prfs_accounts, prfs_circuit_drivers, prfs_circuit_types, prfs_circuits, prfs_indices,
    prfs_polls, prfs_proof_instances, prfs_proof_records, prfs_proof_types, prfs_proofs, prfs_sets,
};

pub fn make_api_v0_router() -> Router<Arc<ServerState>> {
    make_prfs_api_error_code_json_binding().unwrap();

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
        .route("/create_prfs_proof", post(prfs_proofs::create_prfs_proof))
        .route(
            "/get_prfs_proof_by_proof_id",
            post(prfs_proofs::get_prfs_proof_by_proof_id),
        )
        .route("/create_prfs_set", post(prfs_sets::create_prfs_set))
        .route("/get_prfs_sets", post(prfs_sets::get_prfs_sets))
        .route(
            "/get_prfs_set_by_set_id",
            post(prfs_sets::get_prfs_set_by_set_id),
        )
        .route(
            "/create_prfs_proof_type",
            post(prfs_proof_types::create_prfs_proof_type),
        )
        .route("/get_prfs_polls", post(prfs_polls::get_prfs_polls))
        .route(
            "/get_prfs_poll_by_poll_id",
            post(prfs_polls::get_prfs_poll_by_poll_id),
        )
        .route(
            "/get_prfs_poll_result_by_poll_id",
            post(prfs_polls::get_prfs_poll_result_by_poll_id),
        )
        .route(
            "/submit_prfs_poll_response",
            post(prfs_polls::submit_prfs_poll_response),
        )
        .route("/create_prfs_poll", post(prfs_polls::create_prfs_poll))
        .route(
            "/get_least_recent_prfs_index",
            post(prfs_indices::get_least_recent_prfs_index),
        )
        .route("/get_prfs_indices", post(prfs_indices::get_prfs_indices))
        .route("/add_prfs_index", post(prfs_indices::add_prfs_index))
        .route(
            "/get_prfs_proof_record",
            post(prfs_proof_records::get_prfs_proof_record),
        )
        .route(
            "/create_prfs_proof_record",
            post(prfs_proof_records::create_prfs_proof_record),
        );

    router
}
