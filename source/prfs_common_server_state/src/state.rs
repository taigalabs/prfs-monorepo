use chrono::{DateTime, Utc};
use ethers_core::k256::ecdsa::SigningKey;
use ethers_signers::Wallet;
use futures::stream::SplitSink;
use prfs_axum_lib::axum::extract::ws::{Message, WebSocket};
use prfs_db_driver::database2::Database2;
use prfs_tree_server_task_queue::TreeServerTaskQueue;
use prfs_web_fetcher::destinations::infura::InfuraFetcher;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct ServerState {
    pub db2: Database2,
    pub wallet: Wallet<SigningKey>,
    pub launch_time: DateTime<Utc>,
    pub commit_hash: String,

    // prfs_atst_server
    pub infura_fetcher: InfuraFetcher,

    // prfs_id_session_server
    pub peer_map: PeerMap,

    // prfs_tree_server
    pub tree_server_task_queue: TreeServerTaskQueue,
}

pub type PeerMap = Arc<Mutex<HashMap<String, Arc<Mutex<SplitSink<WebSocket, Message>>>>>>;
