use serde::{Deserialize, Serialize};
use sqlx::Type;
use ts_rs::TS;

use super::{AddrMembershipV1Data, MerkleSigPosRangeV1Data, SimpleHashV1Data};

#[derive(Debug, Serialize, Deserialize, Clone, Type, TS)]
#[allow(non_camel_case_types)]
// #[serde(rename_all = "snake_case")]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum CircuitTypeId {
    simple_hash_v1,
    addr_membership_v1,
    merkle_sig_pos_range_v1,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum CircuitTypeData {
    simple_hash_v1(SimpleHashV1Data),
    addr_membership_v1(AddrMembershipV1Data),
    merkle_sig_pos_range_v1(MerkleSigPosRangeV1Data),
}

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
