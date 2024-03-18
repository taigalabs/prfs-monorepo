use chrono::{DateTime, Utc};
use colored::Colorize;
use ethers_signers::LocalWallet;
use git2::Repository;
use prfs_axum_lib::reqwest::Client;
use prfs_common_server_state::ServerState;
use prfs_db_driver::database2::Database2;
use prfs_web_fetcher::destinations::infura::InfuraFetcher;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::{envs::ENVS, paths::PATHS, ApiServerError};

pub async fn init_server_state() -> Result<ServerState, ApiServerError> {
    // let repo = match Repository::open(&PATHS.workspace_dir) {
    //     Ok(repo) => repo,
    //     Err(e) => panic!("failed to init: {}", e),
    // };

    // let commit_hash = {
    //     let mut revwalk = repo.revwalk().unwrap();
    //     revwalk.push_head()?;
    //     let commit_hash = revwalk.next().unwrap().unwrap();
    //     commit_hash
    // };
    //
    let commit_hash = std::env::var("GIT_COMMIT_HASH").unwrap_or("aaa".to_string());
    println!("123 : {:?}", commit_hash);

    let db2 = {
        let pg_endpoint = &ENVS.postgres_endpoint;
        let pg_username = &ENVS.postgres_username;
        let pg_pw = &ENVS.postgres_pw;

        let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
            .await
            .unwrap();
        db2
    };

    let infura_fetcher = InfuraFetcher::new();
    let wallet = ENVS.prfs_api_private_key.parse::<LocalWallet>()?;
    let launch_time: DateTime<Utc> = Utc::now();

    // let client = Client::new();

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
        // client,
    })
}
