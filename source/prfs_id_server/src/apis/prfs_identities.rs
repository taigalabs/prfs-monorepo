use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{parse_req, ApiHandlerResult, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    PrfsIdentitySignInRequest, PrfsIdentitySignInResponse, PrfsIdentitySignUpRequest,
    PrfsIdentitySignUpResponse,
};
use prfs_entities::entities::PrfsIdentity;
use prfs_entities::{
    apis_entities::{PrfsSignInRequest, PrfsSignInResponse, PrfsSignUpRequest, PrfsSignUpResponse},
    entities::PrfsAccount,
    sqlx::types::Json,
};
use std::sync::Arc;

pub async fn sign_up_prfs_identity(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: PrfsIdentitySignUpRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let prfs_account = PrfsIdentity {
        identity_id: req.identity_id.to_string(),
        avatar_color: req.avatar_color.to_string(),
    };

    let identity_id = match db_apis::insert_prfs_identity(&mut tx, &prfs_account).await {
        Ok(i) => i,
        Err(_err) => {
            let resp =
                ApiResponse::new_error(format!("Account may exist, id: {}", req.identity_id));
            return Ok(resp.into_hyper_response());
        }
    };

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(PrfsIdentitySignUpResponse {
        identity_id: identity_id.to_string(),
    });

    return Ok(resp.into_hyper_response());
}

pub async fn sign_in_prfs_identity(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: PrfsIdentitySignInRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_identity = db_apis::get_prfs_identity_by_id(pool, &req.identity_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(PrfsIdentitySignInResponse { prfs_identity });

    return Ok(resp.into_hyper_response());
}
