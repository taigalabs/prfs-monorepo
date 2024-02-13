use serde::{Deserialize, Serialize};
use sqlx::Type;
use ts_rs::TS;

use super::{AddrMembershipV1Data, MerkleSigPosRangeV1Data, SimpleHashV1Data};

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
#[serde(tag = "type", rename_all = "snake_case")]
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

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct SigData {
    msgRaw: String,
    msgHash: String,
    sig: String,
}
