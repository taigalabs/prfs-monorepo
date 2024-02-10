use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{SigData, SpartanMerkleProof};

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
    desc: String,
    prfs_set_id: String,
}
