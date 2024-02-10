use serde::{Deserialize, Serialize};
use sqlx::Type;
use ts_rs::TS;

use crate::{circuit_types::SpartanMerkleProof, sig_data::SigData};

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct AddrMembershipV1Inputs {
    sigData: SigData,
    merkleProof: SpartanMerkleProof,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct AddrMembershipV1Data {
    label: String,
    value: String,
    prfs_set_id: String,
}
