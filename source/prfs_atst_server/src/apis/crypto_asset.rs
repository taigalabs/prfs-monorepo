use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{empty, parse_req, ApiHandlerResult};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::atst_api_entities::{
    ComputeCryptoSizeTotalValuesRequest, ComputeCryptoSizeTotalValuesResponse,
    CreateCryptoSizeAtstRequest, CreateCryptoSizeAtstResponse, FetchCryptoAssetRequest,
    FetchCryptoAssetResponse, GetCryptoSizeAtstRequest, GetCryptoSizeAtstResponse,
    GetCryptoSizeAtstsRequest, GetCryptoSizeAtstsResponse,
};
use prfs_entities::entities::{PrfsAtstStatus, PrfsCryptoSizeAtst};
use prfs_entities::sqlx::types::Json;
use prfs_web_fetcher::destinations::coinbase::{self};
use prfs_web_fetcher::destinations::infura::{self, InfuraFetcher};
use rust_decimal::Decimal;
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODE;
use crate::AtstServerError;

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

pub async fn create_crypto_size_atst(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: CreateCryptoSizeAtstRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let crypto_size_atst = PrfsCryptoSizeAtst {
        atst_id: req.atst_id,
        atst_type: req.atst_type,
        wallet_addr: req.wallet_addr,
        cm: req.cm,
        crypto_assets: Json::from(req.crypto_assets),
        status: PrfsAtstStatus::Valid,
        total_value_usd: Decimal::from(0),
    };
    let atst_id = prfs::insert_prfs_crypto_size_atst(&mut tx, &crypto_size_atst)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.TWITTER_ACC_ATST_INSERT_FAIL, err))?;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreateCryptoSizeAtstResponse {
        is_valid: true,
        atst_id,
    });
    let resp = ApiResponse::new_success(resp);
    return Ok(resp.into_hyper_response());
}

pub async fn get_crypto_size_atsts(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetCryptoSizeAtstsRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let rows = prfs::get_prfs_crypto_size_atsts(&pool, req.offset, LIMIT)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(req.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetCryptoSizeAtstsResponse { rows, next_offset });
    return Ok(resp.into_hyper_response());
}

pub async fn get_crypto_size_atst(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetCryptoSizeAtstRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let prfs_crypto_size_atst = prfs::get_prfs_crypto_size_atst(&pool, &req.atst_id)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    let resp = ApiResponse::new_success(GetCryptoSizeAtstResponse {
        prfs_crypto_size_atst,
    });
    return Ok(resp.into_hyper_response());
}

pub async fn compute_crypto_size_total_values(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: ComputeCryptoSizeTotalValuesRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let eth_to_usd = coinbase::get_exchange_rates("ETH").await.unwrap();
    println!("pp: {:?}", eth_to_usd);

    let atsts = prfs::get_prfs_crypto_size_atsts(&pool, 0, 50000)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    for atst in atsts {
        if let Some(c) = atst.crypto_assets.get(0) {
            println!("aa: {}", c.amount);
        }
    }

    let mut tx = pool.begin().await.unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(eth_to_usd);
    let resp = ApiResponse::new_success(resp);
    return Ok(resp.into_hyper_response());
}
