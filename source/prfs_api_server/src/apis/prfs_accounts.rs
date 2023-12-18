use hyper::body::Incoming;
use hyper::Request;
use hyper_utils::io::{parse_req, ApiHandlerResult};
use hyper_utils::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{PrfsSignInRequest, PrfsSignInResponse, PrfsSignUpRequest, PrfsSignUpResponse},
    entities::PrfsAccount,
    sqlx::types::Json,
};
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODES;

pub async fn sign_up_prfs_account(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: PrfsSignUpRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let prfs_account = PrfsAccount {
        account_id: req.account_id.to_string(),
        public_key: req.public_key.to_string(),
        avatar_color: req.avatar_color.to_string(),
        policy_ids: Json::from(vec![]),
    };

    let account_id = db_apis::insert_prfs_account(&mut tx, &prfs_account)
        .await
        .map_err(|_err| {
            hyper_utils::ApiHandleError::from(
                &API_ERROR_CODES.USER_ALREADY_EXISTS,
                req.account_id.into(),
            )
        })?;
    //     {
    //     Ok(i) => i,
    //     Err(_err) => {
    //         let resp = ApiResponse::new_error(format!("Account may exist, id: {}", req.account_id));
    //         return Ok(resp.into_hyper_response());
    //     }
    // };

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(PrfsSignUpResponse {
        account_id: account_id.to_string(),
    });

    return Ok(resp.into_hyper_response());
}

pub async fn sign_in_prfs_account(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: PrfsSignInRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_account = db_apis::get_prfs_account_by_account_id(pool, &req.account_id)
        .await
        .map_err(|_err| {
            hyper_utils::ApiHandleError::from(
                &API_ERROR_CODES.CANNOT_FIND_USER,
                req.account_id.into(),
            )
        })?;
    // {
    //     Ok(v) => v,
    //     Err(err) => {
    //         let resp = ApiResponse::new_error(format!("Account may exist, id: {}", req.account_id));
    //         return Ok(resp.into_hyper_response());
    //     }
    // };

    let resp = ApiResponse::new_success(PrfsSignInResponse { prfs_account });

    return Ok(resp.into_hyper_response());
}
