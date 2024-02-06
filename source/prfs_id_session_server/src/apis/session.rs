use futures::{SinkExt, StreamExt};
use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_tungstenite2::{tungstenite, HyperWebsocket};
use hyper_utils::error::ApiHandleError;
use hyper_utils::io::{full, BytesBoxBody};
use prfs_common_server_state::ServerState;
use prfs_entities::id_session_api_entities::{PrfsIdMsg, PrfsIdMsgType};
use std::sync::Arc;
use tungstenite::error::ProtocolError;
use tungstenite::handshake::derive_accept_key;
use tungstenite::protocol::WebSocketConfig;
use tungstenite::Message;

use crate::IdSessionServerError;

/// Handle a HTTP or WebSocket request.
pub async fn open_session(
    mut request: Request<Incoming>,
    _state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiHandleError> {
    // Check if the request is a websocket upgrade request.
    if hyper_tungstenite2::is_upgrade_request(&request) {
        let (response, websocket) = hyper_tungstenite2::upgrade(&mut request, None).unwrap();

        // Spawn a task to handle the websocket connection.
        tokio::spawn(async move {
            if let Err(e) = serve_websocket(websocket).await {
                eprintln!("Error in websocket connection: {e}");
            }
        });

        return Ok(response);
    } else {
        Ok(Response::new(full("Hello HTTP!")))
    }
}

/// Handle a websocket connection.
async fn serve_websocket(websocket: HyperWebsocket) -> Result<(), IdSessionServerError> {
    let mut websocket = websocket.await?;
    while let Some(message) = websocket.next().await {
        match message? {
            Message::Text(msg) => {
                println!("Received text message: {msg}");

                let prfs_id_session_msg: PrfsIdMsg<serde_json::Value> =
                    match serde_json::from_str(&msg) {
                        Ok(m) => m,
                        Err(err) => {
                            let err_str = err.to_string();
                            websocket.send(Message::text(err_str)).await?;

                            return Ok(());
                        }
                    };

                println!("prfs_id_session_msg: {:?}", prfs_id_session_msg);

                // match prfs_id_session_msg {
                //     PrfsIdSessionMsg::RequestSignIn(msg) => {
                //         println!("123");
                //     }
                //     PrfsIdSessionMsg::RequestProofGen(m) => {
                //         println!("234");
                //     }
                //     _ => {
                //         println!("error")
                //     }
                // };

                websocket
                    .send(Message::text("Thank you, come again."))
                    .await?;
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
