use axum::{
    extract::{
        ws::{Message, WebSocket},
        MatchedPath, Request, State, WebSocketUpgrade,
    },
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    response::Response,
    routing::{get, post},
    Json, Router,
};
use futures::stream::SplitSink;
use futures::{SinkExt, StreamExt};
use hyper::body::Incoming;
use hyper::upgrade::Upgraded;
use hyper_tungstenite2::{peer_map, tungstenite, HyperWebsocket};
use hyper_util::rt::TokioIo;
use prfs_axum_lib::error::ApiHandleError;
use prfs_axum_lib::io::{full, BytesBoxBody};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::entities::PrfsIdSession;
use prfs_entities::id_session_api::{
    ClosePrfsIdSessionMsgPayload, ClosePrfsIdSessionResult, OpenPrfsIdSessionMsgPayload,
    OpenPrfsIdSessionResult, PrfsIdSessionMsg, PrfsIdSessionResponse, PrfsIdSessionResponsePayload,
};
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::IdSessionServerError;

pub async fn open_prfs_id_session(
    State(state): State<Arc<ServerState>>,
    ws: WebSocketUpgrade,
) -> Response {
    ws.on_upgrade(move |socket| serve_websocket(socket, state))
}

// async fn integration_testable_handle_socket(mut socket: WebSocket) {
//     while let Some(Ok(msg)) = socket.recv().await {
//         if let Message::Text(msg) = msg {
//             if socket
//                 .send(Message::Text(format!("You said: {msg}")))
//                 .await
//                 .is_err()
//             {
//                 break;
//             }
//         }
//     }
// }

// pub async fn open_prfs_id_session(
//     mut request: Request<Incoming>,
//     state: Arc<ServerState>,
//     // State(state): State<Arc<ServerState>>,
//     // Json(input): Json<GetPrfsTreeNodesByPosRequest>,
//     // ws: WebSocketUpgrade,
// ) -> Result<Response<BytesBoxBody>, ApiHandleError> {
//     // Check if the request is a websocket upgrade request.
//     if hyper_tungstenite2::is_upgrade_request(&request) {
//         let (response, websocket) = hyper_tungstenite2::upgrade(&mut request, None).unwrap();

//         tokio::spawn(async {
//             if let Err(e) = serve_websocket(websocket, state).await {
//                 eprintln!("Error in websocket connection: {e}");
//             }
//         });

//         return Ok(response);
//     } else {
//         // Normal HTTP request shouldn't be reached at this route
//         Ok(Response::new(full("Wrong path")))
//     }
// }

/// Handle a websocket connection.
async fn serve_websocket(websocket: WebSocket, state: Arc<ServerState>) {
    // let websocket = websocket.await?;
    let (tx, mut rx) = websocket.split();
    let tx = Arc::new(Mutex::new(tx));
    let mut key = String::from("");

    while let Some(message) = rx.next().await {
        match message.unwrap() {
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
                // No need to send a reply: tungstenite takes care of this for you.
                println!("Received ping message: {msg:02X?}");
            }
            Message::Pong(msg) => {
                println!("Received pong message: {msg:02X?}");
            }
            Message::Close(msg) => {
                // No need to send a reply: tungstenite takes care of this for you.
                if let Some(msg) = &msg {
                    println!(
                        "Received close message with code {} and message: {}",
                        msg.code, msg.reason
                    );
                } else {
                    println!("Received close message");
                }

                handle_close_session_by_system(tx.clone(), &key, state.clone()).await;
                let mut peer_map = state.peer_map.lock().await;
                peer_map.remove(&key);
                println!("Current peer_map size: {}", peer_map.len());
            } // Message::Frame(_msg) => {
              //     unreachable!();
              // }
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

    let _key = prfs::delete_prfs_session_without_dicket(&mut trx, &key)
        .await
        .unwrap();

    trx.commit().await.unwrap();
}
