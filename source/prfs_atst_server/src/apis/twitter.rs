use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{empty, parse_req, ApiHandlerResult};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::db_apis;
use prfs_entities::atst_api_entities::{
    AttestTwitterAccRequest, AttestTwitterAccResponse, GetTwitterAccAtstRequest,
    GetTwitterAccAtstResponse, GetTwitterAccAtstsRequest, GetTwitterAccAtstsResponse,
    ValidateTwitterAccRequest, ValidateTwitterAccResponse,
};
use prfs_entities::entities::{PrfsAccAtst, PrfsAccAtstStatus};
use prfs_web_scraper::destinations::twitter;
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODE;
use crate::AtstServerError;

const LIMIT: i32 = 20;

pub async fn validate_twitter_acc(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: ValidateTwitterAccRequest = parse_req(req).await;

    let validation = twitter::scrape_tweet(&req.tweet_url, &req.twitter_handle)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.TWITTER_ACC_VALIDATE_FAIL, err))?;

    let resp = ApiResponse::new_success(ValidateTwitterAccResponse {
        is_valid: true,
        validation,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn attest_twitter_acc(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: AttestTwitterAccRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let prfs_acc_atst = PrfsAccAtst {
        acc_atst_id: req.acc_atst_id,
        atst_type: req.validation.atst_type,
        dest: req.validation.dest,
        account_id: req.validation.account_id,
        cm: req.validation.cm,
        username: req.validation.username,
        avatar_url: req.validation.avatar_url,
        document_url: req.validation.document_url,
        status: PrfsAccAtstStatus::Valid,
    };

    let acc_atst_id = db_apis::insert_prfs_acc_atst(&mut tx, &prfs_acc_atst)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.TWITTER_ACC_ATST_INSERT_FAIL, err))?;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(AttestTwitterAccResponse {
        is_valid: true,
        acc_atst_id,
    });

    let resp = ApiResponse::new_success(resp);

    return Ok(resp.into_hyper_response());
}

pub async fn get_twitter_acc_atsts(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetTwitterAccAtstsRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let rows = db_apis::get_prfs_acc_atsts(&pool, req.offset, LIMIT)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.TWITTER_ACC_ATST_INSERT_FAIL, err))?;

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(req.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetTwitterAccAtstsResponse { rows, next_offset });
    return Ok(resp.into_hyper_response());
}

pub async fn get_twitter_acc_atst(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetTwitterAccAtstRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let prfs_acc_atst = db_apis::get_prfs_acc_atst(&pool, &req.acc_atst_id)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.TWITTER_ACC_ATST_INSERT_FAIL, err))?;

    let resp = ApiResponse::new_success(GetTwitterAccAtstResponse { prfs_acc_atst });
    return Ok(resp.into_hyper_response());
}
