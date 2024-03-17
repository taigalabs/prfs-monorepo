use futures::SinkExt;
use prfs_axum_lib::axum::extract::ws::Message;
use prfs_common_server_state::ServerState;
use prfs_db_driver::sqlx::postgres::PgListener;
use prfs_db_interface::prfs;
use prfs_entities::id_session_api::{
    PrfsIdSessionResponse, PrfsIdSessionResponsePayload, PutPrfsIdSessionValueResult,
};
use std::sync::Arc;

use crate::IdSessionServerError;

pub const PRFS_ID_SESSION_CHAN: &str = "prfs_id_session_chan";

pub async fn start_listening_to_prfs_id_session_db_events(
    server_state: Arc<ServerState>,
) -> Result<(), IdSessionServerError> {
    tracing::info!("Start_listening to prfs id session events");
    let pool = &server_state.db2.pool;

    let mut listener = PgListener::connect_with(&pool).await.unwrap();
    listener.listen(PRFS_ID_SESSION_CHAN).await.unwrap();

    loop {
        let notification = listener.recv().await?;
        let session_key: String = serde_json::from_str(notification.payload()).unwrap();
        let peer_map_lock = server_state.peer_map.lock().await;
        println!(
            "prfs_id_session db event, key: {}, peer map keys: {:?}",
            session_key,
            peer_map_lock.keys(),
        );

        if let Some(tx) = peer_map_lock.get(&session_key) {
            if let Ok(session_result) = prfs::get_prfs_id_session(&pool, &session_key).await {
                if let Some(s) = session_result {
                    let resp = PrfsIdSessionResponse {
                        error: None,
                        payload: Some(PrfsIdSessionResponsePayload::PutPrfsIdSessionValueResult(
                            PutPrfsIdSessionValueResult {
                                key: session_key.to_string(),
                                value: s.value,
                            },
                        )),
                    };
                    let resp = serde_json::to_string(&resp).unwrap();
                    let mut tx_lock = tx.lock().await;

                    println!("Sending session resp to peer, key: {}", session_key);
                    if let Err(err) = tx_lock.send(Message::Text(resp)).await {
                        println!("Failed to send a response, err: {:?}", err);
                    }
                }
            } else {
                println!("Strange, session isn't found, key: {}", session_key);
            }
        } else {
            println!(
                "Can't find the peer, she might have closed the connection, key: {},\
                    peer map len: {}",
                session_key,
                peer_map_lock.len(),
            );
        }
    }
}
