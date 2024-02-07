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
use prfs_entities::entities::PrfsIdSession;
use prfs_entities::id_session_api_entities::{
    OpenSessionMsgPayload, OpenSessionResult, PrfsIdSessionMsg, PrfsIdSessionResponse,
    PrfsIdSessionResponsePayload,
};
use std::sync::Arc;
use tokio_tungstenite::WebSocketStream;
use tungstenite::Message;

use crate::IdSessionServerError;

pub async fn open_session(
    mut request: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiHandleError> {
    // Check if the request is a websocket upgrade request.
    if hyper_tungstenite2::is_upgrade_request(&request) {
        let (response, websocket) = hyper_tungstenite2::upgrade(&mut request, None).unwrap();

        // Spawn a task to handle the websocket connection.
        // let state_clone = state.clone();
        tokio::spawn(async {
            if let Err(e) = serve_websocket(websocket, state).await {
                eprintln!("Error in websocket connection: {e}");
            }
        });

        return Ok(response);
    } else {
        // At this point, normal HTTP request shouldn't be reached
        Ok(Response::new(full("Wrong path")))
    }
}

/// Handle a websocket connection.
async fn serve_websocket(
    websocket: HyperWebsocket,
    state: Arc<ServerState>,
) -> Result<(), IdSessionServerError> {
    let mut websocket = websocket.await?;
    while let Some(message) = websocket.next().await {
        match message? {
            Message::Text(msg) => {
                println!("Received text message: {msg}");

                let prfs_id_session_msg: PrfsIdSessionMsg = match serde_json::from_str(&msg) {
                    Ok(m) => m,
                    Err(err) => {
                        let resp = PrfsIdSessionResponse {
                            error: Some(err.to_string()),
                            payload: None,
                        };
                        let resp = serde_json::to_string(&resp).unwrap();
                        websocket.send(Message::text(resp)).await.unwrap();

                        return Ok(());
                    }
                };

                println!("prfs_id_session_msg: {:?}", prfs_id_session_msg);
                match prfs_id_session_msg {
                    PrfsIdSessionMsg::OPEN_SESSION(payload) => {
                        handle_open_session(&mut websocket, payload, state.clone()).await;
                    }
                };

                // websocket
                //     .send(Message::text("Thank you, come again."))
                //     .await?;
            }
            Message::Binary(msg) => {
                println!("Received binary message: {msg:02X?}");
                websocket
                    .send(Message::binary(b"Thank you, come again.".to_vec()))
                    .await?;
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
            }
            Message::Frame(_msg) => {
                unreachable!();
            }
        }
    }

    Ok(())
}

async fn handle_open_session(
    socket: &mut WebSocketStream<TokioIo<Upgraded>>,
    msg: OpenSessionMsgPayload,
    state: Arc<ServerState>,
) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let session = PrfsIdSession {
        key: msg.key,
        value: "".to_string(),
        ticket: msg.ticket,
    };

    let key = prfs::upsert_prfs_id_session(&mut tx, &session)
        .await
        .unwrap();

    let resp = PrfsIdSessionResponse {
        error: None,
        payload: Some(PrfsIdSessionResponsePayload::OpenSessionResult(key)),
    };
    let resp = serde_json::to_string(&resp).unwrap();
    socket.send(Message::text(resp)).await.unwrap();
}
