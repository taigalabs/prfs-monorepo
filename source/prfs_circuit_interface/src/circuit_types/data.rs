use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{AddrMembershipV1Data, MerkleSigPosRangeV1Data, SimpleHashV1Data};

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct SpartanMerkleProof {
    root: i64,
    siblings: Vec<i64>,
    pathIndices: Vec<i16>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct SigData {
    msgRaw: String,
    msgHash: String,
    sig: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct RangeData {
    label: String,
    options: Vec<RangeOption>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct RangeOption {
    label: String,
    lower_bound: i64,
    upper_bound: i64,
}
