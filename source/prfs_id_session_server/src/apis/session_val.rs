use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::error::ApiHandleError;
use hyper_utils::io::{parse_req, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::entities::PrfsIdSession;
use prfs_entities::id_session_api_entities::{
    GetPrfsIdSessionValueRequest, GetPrfsIdSessionValueResponse, PutPrfsIdSessionValueRequest,
    PutPrfsIdSessionValueResponse,
};
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODE;

pub async fn get_prfs_id_session_value(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiHandleError> {
    let req: GetPrfsIdSessionValueRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let session = prfs::get_prfs_id_session(&pool, &req.key)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    let resp = ApiResponse::new_success(GetPrfsIdSessionValueResponse { session });
    return Ok(resp.into_hyper_response());
}

pub async fn put_prfs_id_session_value(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiHandleError> {
    let req: PutPrfsIdSessionValueRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let _old_session = prfs::get_prfs_id_session(&pool, &req.key)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    let session = PrfsIdSession {
        key: req.key.to_string(),
        value: req.value,
        ticket: req.ticket,
    };

    let key = prfs::upsert_prfs_id_session(&mut tx, &session)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(PutPrfsIdSessionValueResponse { key });
    return Ok(resp.into_hyper_response());
}
