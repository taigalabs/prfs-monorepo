use prfs_atst_api_error_codes::bindgen::make_prfs_atst_api_error_code_json_binding;
use prfs_axum_lib::axum::{
    routing::{get, post},
    Router,
};
use prfs_common_server_state::ServerState;
use prfs_tree_lib::envs::Envs;
use std::sync::Arc;

use crate::apis::{crypto_asset, prfs_attestations, twitter};

pub const ATST_API_V0: &'static str = "/atst_api/v0";

pub fn make_atst_v0_router() -> Router<Arc<ServerState>> {
    make_prfs_atst_api_error_code_json_binding().unwrap();

    // Try to instantiate
    Envs::new();

    let router = Router::new() //
        .route(
            "/fetch_crypto_asset",
            post(crypto_asset::fetch_crypto_asset),
        )
        .route(
            "/create_crypto_asset_size_atst",
            post(crypto_asset::create_crypto_asset_size_atst),
        )
        // .route(
        //     "/get_crypto_asset_size_atsts",
        //     post(crypto_asset::get_crypto_asset_size_atsts),
        // )
        .route(
            "/get_prfs_attestations",
            post(prfs_attestations::get_prfs_attestations),
        )
        .route(
            "/get_crypto_asset_size_atst",
            post(crypto_asset::get_crypto_asset_size_atst),
        )
        .route(
            "/compute_crypto_asset_size_total_values",
            post(crypto_asset::compute_crypto_asset_size_total_values),
        )
        .route("/validate_twitter_acc", post(twitter::validate_twitter_acc))
        .route("/attest_twitter_acc", post(twitter::attest_twitter_acc))
        .route(
            "/get_twitter_acc_atsts",
            post(twitter::get_twitter_acc_atsts),
        )
        .route("/get_twitter_acc_atst", post(twitter::get_twitter_acc_atst));

    router
}
