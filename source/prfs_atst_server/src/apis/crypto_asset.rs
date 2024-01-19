use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{empty, parse_req, ApiHandlerResult};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_entities::atst_api_entities::{FetchCryptoAssetRequest, FetchCryptoAssetResponse};
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

    let crypto_asset = state
        .infura_fetcher
        .fetch_asset(&req.wallet_addr)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.TWITTER_ACC_VALIDATE_FAIL, err))?;

    let resp = ApiResponse::new_success(FetchCryptoAssetResponse { crypto_asset });

    return Ok(resp.into_hyper_response());
}
