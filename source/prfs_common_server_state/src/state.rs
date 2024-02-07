use chrono::{DateTime, Utc};
use ethers_core::k256::{ecdsa::SigningKey, Secp256k1};
use ethers_signers::{LocalWallet, Signer, Wallet};
use git2::{Oid, Repository};
use hyper_tungstenite2::peer_map::PeerMap;
use prfs_db_interface::database2::Database2;
use prfs_web_fetcher::destinations::infura::InfuraFetcher;
use std::collections::HashMap;

pub struct ServerState {
    pub db2: Database2,
    pub wallet: Wallet<SigningKey>,
    pub launch_time: DateTime<Utc>,
    pub commit_hash: Oid,
    // prfs_atst_server
    pub infura_fetcher: InfuraFetcher,
    // prfs_id_session_server
    pub peer_map: PeerMap,
}
