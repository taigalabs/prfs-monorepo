use prfs_axum_lib::axum::{routing::post, Router};
use prfs_common_server_state::ServerState;
use prfs_tree_api_error_codes::bindgen::make_prfs_tree_api_error_code_json_binding;
use std::sync::Arc;

use crate::apis::{prfs_set_elements, prfs_tree};

pub const TREE_API_V0: &'static str = "/tree_api/v0";

pub fn make_tree_api_v0_router() -> Router<Arc<ServerState>> {
    // Adding a side effect until this server runs standalone
    make_prfs_tree_api_error_code_json_binding().unwrap();

    let router = Router::new()
        .route(
            "/update_prfs_tree_by_new_atst",
            post(prfs_tree::update_prfs_tree_by_new_atst),
        )
        .route(
            "/get_prfs_set_elements",
            post(prfs_set_elements::get_prfs_set_elements),
        )
        .route(
            "/get_prfs_set_element",
            post(prfs_set_elements::get_prfs_set_element),
        )
        .route(
            "/import_prfs_attestations_to_prfs_set",
            post(prfs_set_elements::import_prfs_attestations_to_prfs_set),
        );

    router
}
