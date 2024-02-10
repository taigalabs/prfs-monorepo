use serde::{Deserialize, Serialize};
use sqlx::Type;
use ts_rs::TS;

use crate::{
    addr_membership::AddrMembershipV1Data, merkle_sig_pos_range::MerkleSigPosRangeV1Data,
    simple_hash::SimpleHashV1Data,
};

#[derive(Debug, Serialize, Deserialize, Clone, Type, TS)]
#[allow(non_camel_case_types)]
#[serde(rename_all = "snake_case")]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum CircuitTypeId {
    SimpleHashV1,
    AddrMembershipV1,
    MerkleSigPosRangeV1,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_camel_case_types)]
#[serde(untagged, rename_all = "snake_case")]
#[ts(export)]
pub enum CircuitTypeData {
    SimpleHashV1(SimpleHashV1Data),
    AddrMembershipV1(AddrMembershipV1Data),
    MerkleSigPosRangeV1(MerkleSigPosRangeV1Data),
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct SpartanMerkleProof {
    root: i64,
    siblings: Vec<i64>,
    pathIndices: Vec<i16>,
}
