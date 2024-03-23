use chrono::{DateTime, Utc};
use colored::Colorize;
use ethers_signers::LocalWallet;
use prfs_common_server_state::ServerState;
use prfs_db_driver::database2::Database2;
use prfs_tree_server_task_queue::TreeServerTaskQueue;
use prfs_web_fetcher::destinations::infura::{InfuraFetcher, InfuraFetcherOpt};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::{envs::ENVS, paths::PATHS, ApiServerError};

pub async fn init_server_state() -> Result<ServerState, ApiServerError> {
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

    let tree_server_task_queue = TreeServerTaskQueue::init();

    println!(
        "{} server state, wallet: {:?}, commit_hash: {}, launch_time: {}",
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
        peer_map: Arc::new(Mutex::new(HashMap::new())),
        tree_server_task_queue,
    })
}
