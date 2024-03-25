use futures::stream::SplitSink;
use futures::{SinkExt, StreamExt};
use prfs_axum_lib::axum::http::StatusCode;
use prfs_axum_lib::axum::Json;
use prfs_axum_lib::axum::{
    extract::{
        ws::{Message, WebSocket},
        State, WebSocketUpgrade,
    },
    response::Response,
};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::id_session::PrfsIdSession;
use prfs_entities::id_session_api::{
    ClosePrfsIdSessionMsgPayload, ClosePrfsIdSessionResult, OpenPrfsIdSessionMsgPayload,
    OpenPrfsIdSessionResult, PrfsIdSessionMsg, PrfsIdSessionResponse, PrfsIdSessionResponsePayload,
};
use prfs_entities::{OpenPrfsIdSession2Request, OpenPrfsIdSession2Response};
use prfs_id_session_api_error_codes::{
    PrfsIdSessionApiErrorCodes, PRFS_ID_SESSION_API_ERROR_CODES,
};
use std::sync::Arc;
use tokio::sync::Mutex;

pub async fn open_prfs_id_session(
    State(state): State<Arc<ServerState>>,
    ws: WebSocketUpgrade,
) -> Response {
    ws.on_upgrade(move |socket| serve_websocket(socket, state))
}

pub async fn open_prfs_id_session2(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<OpenPrfsIdSession2Request>,
) -> (StatusCode, Json<ApiResponse<OpenPrfsIdSession2Response>>) {
    let pool = &state.db2.pool;

    let mut tx = bail_out_tx!(pool, &PRFS_ID_SESSION_API_ERROR_CODES.UNKNOWN_ERROR);

    let _session = match prfs::get_prfs_id_session(&pool, &input.key).await {
        Ok(s) => s,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_ID_SESSION_API_ERROR_CODES.SESSION_NOT_EXISTS,
                err.to_string(),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let session = PrfsIdSession {
        key: input.key,
        value: input.value.unwrap_or(vec![]),
        ticket: input.ticket,
    };
    println!("open session2: {:?}", session);

    let key = match prfs::upsert_prfs_id_session(&mut tx, &session).await {
        Ok(k) => k,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_ID_SESSION_API_ERROR_CODES.SESSION_NOT_EXISTS,
                err.to_string(),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    bail_out_tx_commit!(tx, &PRFS_ID_SESSION_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(OpenPrfsIdSession2Response {
        key: key.to_string(),
    });
    return (StatusCode::OK, Json(resp));
}

async fn serve_websocket(websocket: WebSocket, state: Arc<ServerState>) {
    let (tx, mut rx) = websocket.split();
    let tx = Arc::new(Mutex::new(tx));
    let mut key = String::from("");

    while let Some(maybe_message) = rx.next().await {
        match maybe_message {
            Ok(ref message) => match message {
                Message::Text(msg) => {
                    // println!("Received text message: {msg}");
                    let prfs_id_session_msg: PrfsIdSessionMsg = match serde_json::from_str(&msg) {
                        Ok(m) => m,
                        Err(err) => {
                            let resp = PrfsIdSessionResponse {
                                error: Some(err.to_string()),
                                payload: None,
                            };
                            let resp = serde_json::to_string(&resp).unwrap();
                            let mut tx_lock = tx.lock().await;
                            tx_lock.send(Message::Text(resp)).await.unwrap();
                            return;

                            // return Ok(());
                        }
                    };

                    match prfs_id_session_msg {
                        PrfsIdSessionMsg::OpenPrfsIdSession(payload) => {
                            key = payload.key.to_string();
                            handle_open_session(tx.clone(), payload, state.clone()).await;
                        }
                        PrfsIdSessionMsg::ClosePrfsIdSession(payload) => {
                            handle_close_session_by_user(tx.clone(), payload, state.clone()).await;
                        }
                    };
                }
                Message::Binary(msg) => {
                    println!("Received binary message: {msg:02X?}");
                    let mut tx_lock = tx.lock().await;
                    tx_lock
                        .send(Message::Binary(b"Thank you, come again.".to_vec()))
                        .await
                        .unwrap();
                }
                Message::Ping(msg) => {
                    println!("Received ping message: {msg:02X?}");
                }
                Message::Pong(msg) => {
                    println!("Received pong message: {msg:02X?}");
                }
                Message::Close(msg) => {
                    if let Some(_msg) = &msg {
                        println!("Received close message peer, key: {}", key,);
                    } else {
                        println!("Received close message without msg, key: {}", key);
                    }

                    handle_close_session_by_system(tx.clone(), &key, state.clone()).await;
                    let mut peer_map = state.peer_map.lock().await;
                    peer_map.remove(&key);
                    // println!("Current peer_map size: {}", peer_map.len());
                }
            },
            Err(err) => {
                tracing::error!("Failed to parse the message, err: {:?}", err);
            }
        }
    }
}

async fn handle_open_session(
    tx: Arc<Mutex<SplitSink<WebSocket, Message>>>,
    msg: OpenPrfsIdSessionMsgPayload,
    state: Arc<ServerState>,
) {
    let pool = &state.db2.pool;
    let mut trx = pool.begin().await.unwrap();

    let val = msg.value.unwrap_or(vec![]);
    let session = PrfsIdSession {
        key: msg.key,
        value: val,
        ticket: msg.ticket,
    };
    println!("open session: {:?}", session);

    let key = prfs::upsert_prfs_id_session(&mut trx, &session)
        .await
        .unwrap();

    let mut peer_map = state.peer_map.lock().await;
    peer_map.insert(key.to_string(), tx.clone());

    trx.commit().await.unwrap();

    let resp = PrfsIdSessionResponse {
        error: None,
        payload: Some(PrfsIdSessionResponsePayload::OpenPrfsIdSessionResult(
            OpenPrfsIdSessionResult {
                key: key.to_string(),
            },
        )),
    };
    let resp = serde_json::to_string(&resp).unwrap();
    let mut tx_lock = tx.lock().await;
    tx_lock.send(Message::Text(resp)).await.unwrap();
}

async fn handle_close_session_by_user(
    tx: Arc<Mutex<SplitSink<WebSocket, Message>>>,
    msg: ClosePrfsIdSessionMsgPayload,
    state: Arc<ServerState>,
) {
    let pool = &state.db2.pool;
    let mut trx = pool.begin().await.unwrap();

    let _key = prfs::delete_prfs_session(&mut trx, &msg.key, &msg.ticket)
        .await
        .unwrap();

    println!("close session, key: {}", _key);

    trx.commit().await.unwrap();

    let resp = PrfsIdSessionResponse {
        error: None,
        payload: Some(PrfsIdSessionResponsePayload::ClosePrfsIdSessionResult(
            ClosePrfsIdSessionResult {
                key: msg.key.to_string(),
            },
        )),
    };
    let resp = serde_json::to_string(&resp).unwrap();
    let mut tx_lock = tx.lock().await;
    tx_lock.send(Message::Text(resp)).await.unwrap();
}

async fn handle_close_session_by_system(
    _tx: Arc<Mutex<SplitSink<WebSocket, Message>>>,
    key: &String,
    state: Arc<ServerState>,
) {
    let pool = &state.db2.pool;
    let mut trx = pool.begin().await.unwrap();

    let _key = prfs::delete_prfs_session_without_ticket(&mut trx, &key)
        .await
        .unwrap();

    trx.commit().await.unwrap();
}
