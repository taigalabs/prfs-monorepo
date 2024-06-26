use prfs_atst_api_error_codes::bindgen::make_prfs_atst_api_error_code_json_binding;
use prfs_axum_lib::axum::{
    routing::{get, post},
    Router,
};
use prfs_common_server_state::ServerState;
use prfs_tree_lib::envs::Envs;
use std::sync::Arc;

use crate::apis::{crypto_asset, group_members, prfs_atst_groups, prfs_attestations, twitter};

pub const ATST_API_V0: &'static str = "/atst_api/v0";

pub fn make_atst_v0_router() -> Router<Arc<ServerState>> {
    make_prfs_atst_api_error_code_json_binding().unwrap();
    Envs::new();

    let router = Router::new() //
        .route(
            "/get_prfs_attestations_by_atst_group_id",
            post(prfs_attestations::get_prfs_attestations_by_atst_group_id),
        )
        .route(
            "/get_prfs_attestation",
            post(prfs_attestations::get_prfs_attestation),
        )
        .route(
            "/get_prfs_atst_groups",
            post(prfs_atst_groups::get_prfs_atst_groups),
        )
        .route(
            "/get_prfs_atst_groups_by_group_type",
            post(prfs_atst_groups::get_prfs_atst_groups_by_group_type),
        )
        .route(
            "/get_prfs_atst_group_by_group_id",
            post(prfs_atst_groups::get_prfs_atst_group_by_group_id),
        )
        .route(
            "/validate_group_membership",
            post(prfs_atst_groups::validate_group_membership),
        )
        .route(
            "/create_group_member_atst",
            post(group_members::create_group_member_atst),
        )
        .route(
            "/fetch_crypto_asset",
            post(crypto_asset::fetch_crypto_asset),
        )
        .route(
            "/create_crypto_asset_atst",
            post(crypto_asset::create_crypto_asset_atst),
        )
        .route(
            "/compute_crypto_asset_total_values",
            post(crypto_asset::compute_crypto_asset_total_values),
        )
        // .route(
        //     "/compute_group_member_values",
        //     post(group_members::compute_group_member_values),
        // )
        .route("/validate_twitter_acc", post(twitter::validate_twitter_acc))
        .route("/attest_twitter_acc", post(twitter::attest_twitter_acc))
        .route(
            "/get_twitter_acc_atsts",
            post(twitter::get_twitter_acc_atsts),
        )
        .route("/get_twitter_acc_atst", post(twitter::get_twitter_acc_atst));

    router
}
