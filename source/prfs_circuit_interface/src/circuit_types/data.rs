use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct SpartanMerkleProof {
    pub root: i64,
    pub siblings: Vec<i64>,
    pub pathIndices: Vec<i16>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct SigData {
    pub msgRaw: String,
    pub msgHash: String,
    pub sig: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct RangeData {
    pub label: String,
    pub options: Vec<RangeOption>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct RangeOption {
    pub label: String,
    pub lower_bound: i64,
    pub upper_bound: i64,
}
