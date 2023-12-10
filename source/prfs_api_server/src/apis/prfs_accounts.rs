use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{parse_req, BytesBoxBody};
use prfs_common_server_state::ServerState;
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{PrfsSignInRequest, PrfsSignInResponse, PrfsSignUpRequest, PrfsSignUpResponse},
    entities::PrfsAccount,
    sqlx::types::Json,
};
use std::sync::Arc;

use crate::responses::ApiResponse;
use crate::server::types::ApiHandlerResult;

pub async fn sign_up_prfs_account(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: PrfsSignUpRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let prfs_account = PrfsAccount {
        account_id: req.account_id.to_string(),
        avatar_color: req.avatar_color.to_string(),
        policy_ids: Json::from(vec![]),
    };

    let account_id = match db_apis::insert_prfs_account(&mut tx, &prfs_account).await {
        Ok(i) => i,
        Err(_err) => {
            let resp = ApiResponse::new_error(format!("Account may exist, id: {}", req.account_id));
            return Ok(resp.into_hyper_response());
        }
    };

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
        .unwrap();

    let resp = ApiResponse::new_success(PrfsSignInResponse { prfs_account });

    return Ok(resp.into_hyper_response());
}
