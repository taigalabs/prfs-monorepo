use futures::{SinkExt, StreamExt};
use hyper::body::Incoming;
use hyper::upgrade::Upgraded;
use hyper::{Request, Response};
use hyper_tungstenite2::{tungstenite, HyperWebsocket};
use hyper_util::rt::TokioIo;
use hyper_utils::error::ApiHandleError;
use hyper_utils::io::{full, parse_req, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::entities::PrfsIdSession;
use prfs_entities::id_session_api_entities::{
    OpenSessionMsgPayload, OpenSessionResult, PrfsIdSessionMsg, PrfsIdSessionResponse,
    PrfsIdSessionResponsePayload, PutSessionValueRequest, PutSessionValueResponse,
};
use std::sync::Arc;
use tokio_tungstenite::WebSocketStream;
use tungstenite::Message;

use crate::error_codes::API_ERROR_CODE;
use crate::IdSessionServerError;

pub async fn put_session_val(
    mut req: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiHandleError> {
    let req: PutSessionValueRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let old_session =
        prfs::get_prfs_id_session(&pool, &req.key)
            .await
            .ok_or(ApiHandleError::from(
                &API_ERROR_CODE.UNKNOWN_ERROR,
                format!("session does not exist, key: {}", &req.key).into(),
            ))?;

    let session = PrfsIdSession {
        key: req.key.to_string(),
        value: req.value,
        ticket: req.ticket,
    };

    let key = prfs::upsert_prfs_id_session(&mut tx, &session)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(PutSessionValueResponse { key });
    return Ok(resp.into_hyper_response());
}
