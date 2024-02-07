use futures::{SinkExt, StreamExt};
use hyper::body::Incoming;
use hyper::upgrade::Upgraded;
use hyper::{Request, Response};
use hyper_tungstenite2::{tungstenite, HyperWebsocket};
use hyper_util::rt::TokioIo;
use hyper_utils::error::ApiHandleError;
use hyper_utils::io::{full, BytesBoxBody};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::entities::PrfsSession;
use prfs_entities::id_session_api_entities::{
    OpenSessionMsgPayload, OpenSessionResult, PrfsIdSessionMsg, PrfsIdSessionResponse,
    PrfsIdSessionResponsePayload, PutSessionValueRequest,
};
use std::sync::Arc;
use tokio_tungstenite::WebSocketStream;
use tungstenite::Message;

use crate::IdSessionServerError;

pub async fn put_session_val(
    mut request: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiHandleError> {
    let req: PutSessionValueRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let old_session = prfs::get_prfs_id_session(&pool, &req.key).await;

    let session = PrfsSession {
        key: req.key,
        value: req.value,
        ticket: req.ticket,
    };

    let key = prfs::upsert_prfs_id_session(&mut tx, &prfs_identity)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.ID_ALREADY_EXISTS, err))?;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(PrfsIdentitySignUpResponse {
        identity_id: identity_id.to_string(),
    });

    return Ok(resp.into_hyper_response());
}
