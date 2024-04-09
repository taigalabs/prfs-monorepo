use prfs_admin_credential::master_accounts::get_master_account_ids;
use prfs_api_rs::api::update_prfs_tree_by_new_atst;
use prfs_atst_api_error_codes::PRFS_ATST_API_ERROR_CODES;
use prfs_atst_api_ops::ops;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_db_interface::prfs;
use prfs_entities::atst_api::{
    ComputeCryptoAssetTotalValuesRequest, ComputeCryptoAssetTotalValuesResponse,
    FetchCryptoAssetRequest, FetchCryptoAssetResponse,
};
use prfs_entities::atst_entities::{PrfsAtstStatus, PrfsAttestation};
use prfs_entities::{
    CreatePrfsAttestationRequest, CreatePrfsAttestationResponse, CryptoAssetMeta, PrfsAtstMeta,
    PrfsAtstValue, PrfsAtstVersion, UpdatePrfsTreeByNewAtstRequest,
};
use prfs_web3_rs::signature::verify_eth_sig_by_addr;
use rust_decimal::Decimal;
use std::sync::Arc;

use crate::envs::ENVS;

const LIMIT: i32 = 20;

pub async fn fetch_crypto_asset(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<FetchCryptoAssetRequest>,
) -> (StatusCode, Json<ApiResponse<FetchCryptoAssetResponse>>) {
    let fetch_result = match state.infura_fetcher.fetch_asset(&input.wallet_addr).await {
        Ok(r) => r,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(FetchCryptoAssetResponse {
        wallet_addr: fetch_result.wallet_addr,
        crypto_assets: fetch_result.crypto_assets,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn create_crypto_asset_atst(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsAttestationRequest>,
) -> (StatusCode, Json<ApiResponse<CreatePrfsAttestationResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR);

    if let Err(err) = verify_eth_sig_by_addr(&input.sig, &input.cm_msg, &input.label) {
        let resp = ApiResponse::new_error(
            &PRFS_ATST_API_ERROR_CODES.INVALID_SIG,
            format!("sig: {}, err: {}", input.sig, err),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    let crypto_assets = match state.infura_fetcher.fetch_asset(&input.label).await {
        Ok(a) => a.crypto_assets,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_ATST_API_ERROR_CODES.FETCH_CRYPTO_ASSET_FAIL,
                err.to_string(),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let prfs_attestation = PrfsAttestation {
        atst_id: input.atst_id,
        atst_group_id: input.atst_group_id.clone(),
        label: input.label.to_string(),
        cm: input.cm,
        meta: JsonType::from(PrfsAtstMeta::crypto_asset(CryptoAssetMeta {
            assets: crypto_assets,
        })),
        status: PrfsAtstStatus::Valid,
        value: JsonType::from(vec![PrfsAtstValue {
            label: "".into(),
            value_raw: "".into(),
            value_int: "".into(),
            meta: None,
        }]),
        // value_num: Decimal::from(0).to_string(),
        // value_raw: "".into(),
        atst_version: PrfsAtstVersion::v0_2,
    };

    let atst_id = match prfs::insert_prfs_attestation(&mut tx, &prfs_attestation).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_ATST_API_ERROR_CODES.TWITTER_ACC_ATST_INSERT_FAIL,
                err.to_string(),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let _ = match update_prfs_tree_by_new_atst(
        &ENVS.prfs_api_server_endpoint,
        &UpdatePrfsTreeByNewAtstRequest {
            atst_group_id: input.atst_group_id,
        },
    )
    .await
    {
        Ok(r) => r,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    bail_out_tx_commit!(tx, &PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(CreatePrfsAttestationResponse {
        is_valid: true,
        atst_id,
    });
    return (StatusCode::OK, Json(resp));
}

pub(crate) async fn compute_crypto_asset_total_values(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<ComputeCryptoAssetTotalValuesRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<ComputeCryptoAssetTotalValuesResponse>>,
) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR);

    if !get_master_account_ids().contains(&input.account_id.as_ref()) {
        return (
            StatusCode::BAD_REQUEST,
            Json(ApiResponse::new_error(
                &PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Account is not master, id: {}", input.account_id),
            )),
        );
    }

    let compute_value_resp =
        match ops::compute_crypto_asset_total_values(&mut tx, &state.infura_fetcher).await {
            Ok(r) => r,
            Err(err) => {
                return (
                    StatusCode::BAD_REQUEST,
                    Json(ApiResponse::new_error(
                        &PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR,
                        err.to_string(),
                    )),
                );
            }
        };

    println!(
        "Computed crypto size total values, releasing tx, count: {}",
        compute_value_resp.updated_row_count
    );

    bail_out_tx_commit!(tx, &PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(compute_value_resp);
    return (StatusCode::OK, Json(resp));
}
