use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{empty, parse_req, ApiHandlerResult};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::atst_api_entities::{
    CreateCryptoSizeAtstRequest, CreateCryptoSizeAtstResponse, FetchCryptoAssetRequest,
    FetchCryptoAssetResponse,
};
use prfs_entities::entities::{PrfsAtstStatus, PrfsCryptoSizeAtst};
use prfs_web_fetcher::destinations::infura::{self, InfuraFetcher};
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODE;
use crate::AtstServerError;

const LIMIT: i32 = 20;

pub async fn fetch_crypto_asset(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: FetchCryptoAssetRequest = parse_req(req).await;

    let crypto_assets = state
        .infura_fetcher
        .fetch_asset(&req.wallet_addr)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.TWITTER_ACC_VALIDATE_FAIL, err))?;

    let resp = ApiResponse::new_success(FetchCryptoAssetResponse { crypto_assets });
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
        amount: req.amount,
        unit: req.unit,
        status: PrfsAtstStatus::Valid,
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
