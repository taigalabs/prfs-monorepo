use crate::{envs::ENVS, ApiServerError};
use chrono::{DateTime, Utc};
use colored::Colorize;
use ethers_core::{
    k256::{ecdsa::SigningKey, Secp256k1},
    types::TransactionRequest,
};
use ethers_signers::{LocalWallet, Signer, Wallet};
use prfs_db_interface::database2::Database2;

pub struct ServerState {
    pub db2: Database2,
    pub wallet: Wallet<SigningKey>,
    pub status: ServerStatus,
}

#[derive(Debug)]
pub struct ServerStatus {
    launch_time: DateTime<Utc>,
}

impl ServerState {
    pub fn new(db2: Database2) -> Result<ServerState, ApiServerError> {
        let wallet = ENVS.prfs_api_private_key.parse::<LocalWallet>()?;

        let launch_time: DateTime<Utc> = Utc::now();
        let status = ServerStatus { launch_time };

        println!(
            "{} PRFS api wallet: {:?}, status: {:?}",
            "Initialized".green(),
            wallet,
            status
        );

        Ok(ServerState {
            db2,
            wallet,
            status,
        })
    }

    pub fn to_status(&self) -> String {
        self.status.launch_time.to_string()
    }
}
