use chrono::{DateTime, Utc};
use ethers_core::k256::ecdsa::SigningKey;
use ethers_signers::Wallet;
use prfs_db_driver::database2::Database2;
use prfs_tree_server_task_queue::TreeServerTaskQueue;
use prfs_web_fetcher::destinations::infura::InfuraFetcher;
use std::sync::Arc;

use crate::CommonServerStateError;

pub struct ServerState {
    pub db2: Database2,
    pub wallet: Wallet<SigningKey>,
    pub launch_time: DateTime<Utc>,
    pub commit_hash: String,

    // prfs_atst_server
    pub infura_fetcher: InfuraFetcher,

    // prfs_tree_server
    pub tree_server_task_queue: Arc<TreeServerTaskQueue>,
}

pub async fn init_server_state_test() -> Result<ServerState, CommonServerStateError> {
    use colored::Colorize;
    use ethers_signers::LocalWallet;
    use prfs_web_fetcher::destinations::infura::InfuraFetcherOpt;

    use crate::envs::ENVS;

    let commit_hash =
        std::env::var("GIT_COMMIT_HASH").unwrap_or("GIT_COMMIT_HASH not provided".to_string());

    let db2 = {
        let pg_endpoint = &ENVS.postgres_endpoint;
        let pg_username = &ENVS.postgres_username;
        let pg_pw = &ENVS.postgres_pw;

        let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
            .await
            .unwrap();
        db2
    };

    let infura_fetcher = InfuraFetcher::new(InfuraFetcherOpt {
        infura_api_key: ENVS.infura_api_key.to_string(),
    });
    let wallet = ENVS.prfs_api_private_key.parse::<LocalWallet>()?;
    let launch_time: DateTime<Utc> = Utc::now();

    let tree_server_task_queue = Arc::new(TreeServerTaskQueue::init());

    println!(
        "{} common server state, wallet: {:?}, commit_hash: {}, launch_time: {}",
        "Initialized".green(),
        wallet,
        commit_hash,
        launch_time,
    );

    Ok(ServerState {
        db2,
        wallet,
        launch_time,
        commit_hash,
        infura_fetcher,
        tree_server_task_queue,
    })
}
