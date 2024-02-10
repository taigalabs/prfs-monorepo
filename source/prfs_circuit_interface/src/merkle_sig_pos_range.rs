use serde::{Deserialize, Serialize};
use sqlx::Type;
use ts_rs::TS;

use crate::circuit_types::SpartanMerkleProof;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct MerkleSigPosRangeV1Inputs {
    leaf: i64,
    asset_size: i64,
    asset_size_max_limit: i64,
    merkleProof: SpartanMerkleProof,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct MerkleSigPosRangeV1Data {
    prfs_set_id: String,
    label: String,
    desc: String,
}
