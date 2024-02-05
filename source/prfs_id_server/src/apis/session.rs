use futures::sink::SinkExt;
use futures::stream::StreamExt;
use http_body_util::Full;
use hyper::body::{Bytes, Incoming};
use hyper::{Request, Response};
use hyper_tungstenite::{tungstenite, HyperWebsocket};
use hyper_utils::io::{parse_req, ApiHandlerResult, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::entities::PrfsIdentity;
use prfs_entities::prfs_api_entities::{
    PrfsIdentitySignInRequest, PrfsIdentitySignInResponse, PrfsIdentitySignUpRequest,
    PrfsIdentitySignUpResponse,
};
use std::sync::Arc;
use tungstenite::Message;

use crate::error_codes::API_ERROR_CODE;
use crate::IdServerError;

/// Handle a HTTP or WebSocket request.
pub async fn open_session(mut req: Request<Incoming>, state: Arc<ServerState>) -> ApiHandlerResult {
    // Result<Response<BytesBoxBody>, ApiHandleError>
    // Check if the request is a websocket upgrade request.
    if hyper_tungstenite::is_upgrade_request(&req) {
        let (response, websocket) = hyper_tungstenite::upgrade(&mut req, None).unwrap();

        // Spawn a task to handle the websocket connection.
        tokio::spawn(async move {
            if let Err(e) = serve_websocket(websocket).await {
                eprintln!("Error in websocket connection: {e}");
            }
        });

        // Return the response so the spawned future can continue.
        let resp = ApiResponse::new_success(".l".to_string());
        return Ok(resp.into_hyper_response());
        // Ok(response)
    } else {
        // Handle regular HTTP requests here.
        let resp = ApiResponse::new_success(".l".to_string());
        return Ok(resp.into_hyper_response());
        // Ok(Response::new(Full::<Bytes>::from("Hello HTTP!")))
    }
}

/// Handle a websocket connection.
async fn serve_websocket(websocket: HyperWebsocket) -> Result<(), IdServerError> {
    let mut websocket = websocket.await?;
    while let Some(message) = websocket.next().await {
        match message? {
            Message::Text(msg) => {
                println!("Received text message: {msg}");
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
