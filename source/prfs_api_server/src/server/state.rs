use crate::{envs::ENVS, ApiServerError};
use ethers_core::{
    k256::{ecdsa::SigningKey, Secp256k1},
    types::TransactionRequest,
};
use ethers_signers::{LocalWallet, Signer, Wallet};
use prfs_db_interface::database2::Database2;
use colored::Colorize;

pub struct ServerState {
    pub db2: Database2,
    pub wallet: Wallet<SigningKey>,
}

impl ServerState {
    pub fn new(db2: Database2) -> Result<ServerState, ApiServerError> {
        let wallet = ENVS.prfs_api_private_key.parse::<LocalWallet>()?;

        println!("{} PRFS api wallet: {:?}", "Initialized".green(), wallet);

        Ok(ServerState { db2, wallet })
    }
}
