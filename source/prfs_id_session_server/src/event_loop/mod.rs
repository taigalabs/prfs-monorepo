use futures::SinkExt;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    entities::PrfsIdSession,
    id_session_api::{
        PrfsIdSessionResponse, PrfsIdSessionResponsePayload, PutPrfsIdSessionValueResult,
    },
    sqlx::{pool, postgres::PgListener},
};
use std::sync::Arc;
// use tungstenite::Message;

use crate::IdSessionServerError;

pub const PRFS_ID_SESSION_CHAN: &str = "prfs_id_session_chan";

// pub async fn start_listening_to_prfs_id_session_events(
//     server_state: Arc<ServerState>,
// ) -> Result<(), IdSessionServerError> {
//     println!("Start_listening to prfs id session events");
//     let pool = &server_state.db2.pool;

//     let mut listener = PgListener::connect_with(&pool).await.unwrap();
//     listener.listen(PRFS_ID_SESSION_CHAN).await.unwrap();

//     loop {
//         let notification = listener.recv().await?;
//         // println!("prfs id session channel ev: {notification:?}");

//         let session_key: String = serde_json::from_str(notification.payload()).unwrap();
//         println!("prfs id session channel ev key: {}", session_key);

//         let peer_map_lock = server_state.peer_map.lock().await;
//         if let Some(tx) = peer_map_lock.get(&session_key) {
//             if let Ok(session_result) = prfs::get_prfs_id_session(&pool, &session_key).await {
//                 if let Some(s) = session_result {
//                     let resp = PrfsIdSessionResponse {
//                         error: None,
//                         payload: Some(PrfsIdSessionResponsePayload::PutPrfsIdSessionValueResult(
//                             PutPrfsIdSessionValueResult {
//                                 key: session_key.to_string(),
//                                 value: s.value,
//                             },
//                         )),
//                     };
//                     let resp = serde_json::to_string(&resp).unwrap();
//                     let mut tx_lock = tx.lock().await;
//                     tx_lock.send(Message::text(resp)).await.unwrap();
//                 }
//             } else {
//                 println!("Strange, session isn't found, key: {}", session_key);
//             }
//         } else {
//             println!(
//                 "Can't find the peer, she might have closed the connection, key: {},\
//                     peer map len: {}",
//                 session_key,
//                 peer_map_lock.len(),
//             );
//         }
//     }
// }
