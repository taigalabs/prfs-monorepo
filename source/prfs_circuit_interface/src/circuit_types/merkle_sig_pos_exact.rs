use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::SpartanMerkleProof;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct MerkleSigPosExactV1Inputs {
    sigR: i64,
    sigS: i64,
    sigpos: i64,
    leaf: i64,
    value: i64,
    merkleProof: SpartanMerkleProof,
    nonceRaw: String,
    proofPubKey: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct MerkleSigPosExactV1Data {
    prfs_set_id: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct MerkleSigPosExactV1PresetVals {
    nonceRaw: String,
}
