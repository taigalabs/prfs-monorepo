use chrono::{DateTime, Utc};
use colored::Colorize;
use ethers_core::k256::{ecdsa::SigningKey, Secp256k1};
use ethers_signers::{LocalWallet, Signer, Wallet};
use git2::{Oid, Repository};
use prfs_db_interface::database2::Database2;
use prfs_web_scraper::crawler::Crawler;

pub struct ServerState {
    pub db2: Database2,
    pub wallet: Wallet<SigningKey>,
    pub launch_time: DateTime<Utc>,
    pub commit_hash: Oid,
    pub crawler: Crawler,
}
