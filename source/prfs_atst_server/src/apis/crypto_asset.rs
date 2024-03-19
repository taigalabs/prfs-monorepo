use prfs_api_rs::api::update_prfs_tree_by_new_atst;
use prfs_atst_api_error_codes::PRFS_ATST_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_crypto::signature::verify_eth_sig_by_addr;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_db_interface::prfs;
use prfs_entities::atst_api::{
    ComputeCryptoAssetSizeTotalValuesRequest, ComputeCryptoAssetSizeTotalValuesResponse,
    CreateCryptoAssetSizeAtstRequest, CreateCryptoAssetSizeAtstResponse, FetchCryptoAssetRequest,
    FetchCryptoAssetResponse, GetCryptoAssetSizeAtstRequest, GetCryptoAssetSizeAtstResponse,
    GetCryptoAssetSizeAtstsRequest, GetCryptoAssetSizeAtstsResponse,
};
use prfs_entities::atst_entities::{PrfsAtstStatus, PrfsAttestation};
use prfs_entities::{UpdatePrfsTreeByNewAtstRequest, UpdatePrfsTreeNodeRequest};
use prfs_web_fetcher::destinations::coinbase::{self};
use rust_decimal::prelude::FromPrimitive;
use rust_decimal::Decimal;
use std::str::FromStr;
use std::sync::Arc;

use crate::envs::ENVS;
use crate::mock::MASTER_ACCOUNT_IDS;

const LIMIT: i32 = 20;

pub async fn fetch_crypto_asset(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<FetchCryptoAssetRequest>,
) -> (StatusCode, Json<ApiResponse<FetchCryptoAssetResponse>>) {
    let fetch_result = state
        .infura_fetcher
        .fetch_asset(&input.wallet_addr)
        .await
        .map_err(|err| {
            ApiHandleError::from(&PRFS_ATST_API_ERROR_CODES.TWITTER_ACC_VALIDATE_FAIL, err)
        })
        .unwrap();

    let resp = ApiResponse::new_success(FetchCryptoAssetResponse {
        wallet_addr: fetch_result.wallet_addr,
        crypto_assets: fetch_result.crypto_assets,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn create_crypto_asset_size_atst(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreateCryptoAssetSizeAtstRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<CreateCryptoAssetSizeAtstResponse>>,
) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

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
        atst_type: input.atst_type.clone(),
        label: input.label.to_string(),
        cm: input.cm,
        meta: JsonType::from(crypto_assets),
        status: PrfsAtstStatus::Valid,
        value: Decimal::from(0),
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
            atst_type: input.atst_type,
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

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreateCryptoAssetSizeAtstResponse {
        is_valid: true,
        atst_id,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_crypto_asset_size_atsts(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetCryptoAssetSizeAtstsRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<GetCryptoAssetSizeAtstsResponse>>,
) {
    let pool = &state.db2.pool;

    let rows = match prfs::get_prfs_crypto_asset_size_atsts(&pool, input.offset, LIMIT).await {
        Ok(r) => r,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("error getting crypto asset size atsts: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetCryptoAssetSizeAtstsResponse { rows, next_offset });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_crypto_asset_size_atst(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetCryptoAssetSizeAtstRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<GetCryptoAssetSizeAtstResponse>>,
) {
    let pool = &state.db2.pool;

    let prfs_attestation = match prfs::get_prfs_crypto_asset_size_atst(&pool, &input.atst_id).await
    {
        Ok(a) => a,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetCryptoAssetSizeAtstResponse { prfs_attestation });
    return (StatusCode::OK, Json(resp));
}

pub async fn compute_crypto_asset_size_total_values(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<ComputeCryptoAssetSizeTotalValuesRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<ComputeCryptoAssetSizeTotalValuesResponse>>,
) {
    let pool = &state.db2.pool;
    if !MASTER_ACCOUNT_IDS.contains(&input.account_id.as_ref()) {
        return (
            StatusCode::BAD_REQUEST,
            Json(ApiResponse::new_error(
                &PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Account is not master, id: {}", input.account_id),
            )),
        );
    }

    let exchange_rates = match coinbase::get_exchange_rates("ETH").await {
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

    let atsts = match prfs::get_prfs_crypto_asset_size_atsts(&pool, 0, 50000).await {
        Ok(a) => a,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let denom = Decimal::from_u128(1_000_000_000_000_000_000).unwrap();
    let usd: &str = exchange_rates.data.rates.USD.as_ref();
    let usd = Decimal::from_str(usd).unwrap();

    let mut tx = pool.begin().await.unwrap();
    let mut count = 0;
    for mut atst in atsts {
        if let Some(c) = atst.meta.get(0) {
            let v = c.amount * usd / denom;
            atst.value = v;
            match prfs::insert_prfs_attestation(&mut tx, &atst).await {
                Ok(_) => {}
                Err(err) => {
                    let resp = ApiResponse::new_error(
                        &PRFS_ATST_API_ERROR_CODES.CRYPTO_SIZE_UPSERT_FAIL,
                        err.to_string(),
                    );
                    return (StatusCode::BAD_REQUEST, Json(resp));
                }
            }

            count += 1;
        }
    }
    println!(
        "Computed crypto size total values, releasing tx, count: {}",
        count
    );
    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(ComputeCryptoAssetSizeTotalValuesResponse {
        exchange_rates: exchange_rates.data,
        updated_row_count: count,
    });
    return (StatusCode::OK, Json(resp));
}
