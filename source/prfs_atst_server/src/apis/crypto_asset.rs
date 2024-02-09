use hyper::body::Incoming;
use hyper::Request;
use hyper_utils::io::{parse_req, ApiHandlerResult};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::atst_api::{
    ComputeCryptoAssetSizeTotalValuesRequest, ComputeCryptoAssetSizeTotalValuesResponse,
    CreateCryptoAssetSizeAtstRequest, CreateCryptoAssetSizeAtstResponse, FetchCryptoAssetRequest,
    FetchCryptoAssetResponse, GetCryptoAssetSizeAtstRequest, GetCryptoAssetSizeAtstResponse,
    GetCryptoAssetSizeAtstsRequest, GetCryptoAssetSizeAtstsResponse,
};
use prfs_entities::entities::{PrfsAtstStatus, PrfsCryptoAssetSizeAtst};
use prfs_entities::sqlx::types::Json;
use prfs_web_fetcher::destinations::coinbase::{self};
use rust_decimal::prelude::FromPrimitive;
use rust_decimal::Decimal;
use std::str::FromStr;
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODE;
use crate::mock::MASTER_ACCOUNT_ID;

const LIMIT: i32 = 20;

pub async fn fetch_crypto_asset(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: FetchCryptoAssetRequest = parse_req(req).await;

    let fetch_result = state
        .infura_fetcher
        .fetch_asset(&req.wallet_addr)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.TWITTER_ACC_VALIDATE_FAIL, err))?;

    let resp = ApiResponse::new_success(FetchCryptoAssetResponse {
        wallet_addr: fetch_result.wallet_addr,
        crypto_assets: fetch_result.crypto_assets,
    });
    return Ok(resp.into_hyper_response());
}

pub async fn create_crypto_asset_size_atst(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: CreateCryptoAssetSizeAtstRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let crypto_size_atst = PrfsCryptoAssetSizeAtst {
        atst_id: req.atst_id,
        atst_type: req.atst_type,
        wallet_addr: req.wallet_addr.to_string(),
        cm: req.cm,
        crypto_assets: Json::from(req.crypto_assets),
        status: PrfsAtstStatus::Valid,
        total_value_usd: Decimal::from(0),
    };
    let atst_id = prfs::insert_prfs_crypto_asset_size_atst(&mut tx, &crypto_size_atst)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.TWITTER_ACC_ATST_INSERT_FAIL, err))?;

    // let _wallet_prfs_idx = prfs::upsert_prfs_index(
    //     &mut tx,
    //     &req.wallet_prfs_idx,
    //     &req.wallet_addr,
    //     &req.serial_no,
    // )
    // .await
    // .unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreateCryptoAssetSizeAtstResponse {
        is_valid: true,
        atst_id,
    });
    return Ok(resp.into_hyper_response());
}

pub async fn get_crypto_asset_size_atsts(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetCryptoAssetSizeAtstsRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let rows = prfs::get_prfs_crypto_asset_size_atsts(&pool, req.offset, LIMIT)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(req.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetCryptoAssetSizeAtstsResponse { rows, next_offset });
    return Ok(resp.into_hyper_response());
}

pub async fn get_crypto_asset_size_atst(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetCryptoAssetSizeAtstRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let prfs_crypto_asset_size_atst = prfs::get_prfs_crypto_asset_size_atst(&pool, &req.atst_id)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    let resp = ApiResponse::new_success(GetCryptoAssetSizeAtstResponse {
        prfs_crypto_asset_size_atst,
    });
    return Ok(resp.into_hyper_response());
}

pub async fn compute_crypto_asset_size_total_values(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let pool = &state.db2.pool;
    let req: ComputeCryptoAssetSizeTotalValuesRequest = parse_req(req).await;

    if req.account_id != MASTER_ACCOUNT_ID {
        return Err(ApiHandleError::from(
            &API_ERROR_CODE.UNKNOWN_ERROR,
            "".into(),
        ));
    }

    let exchange_rates = coinbase::get_exchange_rates("ETH").await.unwrap();
    let atsts = prfs::get_prfs_crypto_asset_size_atsts(&pool, 0, 50000)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    let denom = Decimal::from_u128(1_000_000_000_000_000_000).unwrap();
    let usd: &str = exchange_rates.data.rates.USD.as_ref();
    let usd = Decimal::from_str(usd).unwrap();

    let mut tx = pool.begin().await.unwrap();
    let mut count = 0;
    for mut atst in atsts {
        if let Some(c) = atst.crypto_assets.get(0) {
            let v = c.amount * usd / denom;
            atst.total_value_usd = v;
            prfs::insert_prfs_crypto_asset_size_atst(&mut tx, &atst)
                .await
                .map_err(|err| {
                    ApiHandleError::from(&API_ERROR_CODE.CRYPTO_SIZE_UPSERT_FAIL, err)
                })?;

            count += 1;
        }
    }
    println!(
        "Computed crypto size total values, releasing tx, count: {}",
        count
    );
    tx.commit().await.unwrap();

    let resp = ComputeCryptoAssetSizeTotalValuesResponse {
        exchange_rates: exchange_rates.data,
        updated_row_count: count,
    };
    let resp = ApiResponse::new_success(resp);
    return Ok(resp.into_hyper_response());
}
