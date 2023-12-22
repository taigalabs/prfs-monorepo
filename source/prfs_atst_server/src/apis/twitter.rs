use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{parse_req, ApiHandlerResult, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    PrfsIdentitySignInRequest, PrfsIdentitySignInResponse, PrfsIdentitySignUpRequest,
    PrfsIdentitySignUpResponse,
};
use prfs_entities::atst_api_entities::{ScrapeTwitterRequest, ScrapeTwitterResponse};
use prfs_entities::entities::PrfsIdentity;
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODE;

pub async fn scrape_tweet(req: Request<Incoming>, state: Arc<ServerState>) -> ApiHandlerResult {
    let req: ScrapeTwitterRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    // let mut tx = pool.begin().await.unwrap();
    // let prfs_identity = PrfsIdentity {
    //     identity_id: req.identity_id.to_string(),
    //     avatar_color: req.avatar_color.to_string(),
    // };

    // let identity_id = db_apis::insert_prfs_identity(&mut tx, &prfs_identity)
    //     .await
    //     .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    // tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(ScrapeTwitterResponse { is_valid: false });

    return Ok(resp.into_hyper_response());
}
