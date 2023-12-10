use crate::{envs::ENVS, paths::PATHS, ApiServerError};
use chrono::{DateTime, Utc};
use colored::Colorize;
use ethers_core::k256::{ecdsa::SigningKey, Secp256k1};
use ethers_signers::{LocalWallet, Signer, Wallet};
use git2::{Oid, Repository};
use prfs_common_server_state::ServerState;
use prfs_db_interface::database2::Database2;

pub async fn init_server_state() -> Result<ServerState, ApiServerError> {
    let repo = match Repository::open(&PATHS.workspace_dir) {
        Ok(repo) => repo,
        Err(e) => panic!("failed to init: {}", e),
    };

    let mut revwalk = repo.revwalk().unwrap();
    revwalk.push_head()?;
    let commit_hash = revwalk.next().unwrap().unwrap();

    let pg_endpoint = &ENVS.postgres_endpoint;
    let pg_username = &ENVS.postgres_username;
    let pg_pw = &ENVS.postgres_pw;

    let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
        .await
        .unwrap();
    let wallet = ENVS.prfs_api_private_key.parse::<LocalWallet>()?;

    let launch_time: DateTime<Utc> = Utc::now();

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
    })
}
