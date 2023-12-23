use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{empty, parse_req, ApiHandlerResult, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::PrfsIdentitySignUpResponse;
use prfs_entities::atst_api_entities::{AttestTwitterAccRequest, AttestTwitterAccResponse};
use prfs_entities::entities::PrfsAccAtst;
use prfs_web_scraper::destinations::twitter;
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODE;
use crate::AtstServerError;

pub async fn scrape_tweet(req: Request<Incoming>, state: Arc<ServerState>) -> ApiHandlerResult {
    let req: AttestTwitterAccRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let twitter_scrape = twitter::scrape_tweet(&req.tweet_url, &req.twitter_handle)
        .await
        .unwrap();

    let prfs_acc_atst = PrfsAccAtst {
        acc_atst_id: req.acc_atst_id,
        atst_type: twitter_scrape.atst_type,
        dest: twitter_scrape.dest,
        account_id: twitter_scrape.account_id,
        cm: twitter_scrape.cm,
        username: twitter_scrape.username,
        avatar_url: twitter_scrape.avatar_url,
        document_url: twitter_scrape.document_url,
    };

    let acc_atst_id = db_apis::insert_prfs_acc_atst(&mut tx, &prfs_acc_atst)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(AttestTwitterAccResponse {
        is_valid: true,
        acc_atst_id,
    });

    let resp = ApiResponse::new_success(resp);

    return Ok(resp.into_hyper_response());
}
