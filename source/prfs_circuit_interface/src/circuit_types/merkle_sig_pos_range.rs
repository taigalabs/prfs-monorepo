use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{RangeData, SpartanMerkleProof};

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct MerkleSigPosRangeV1Inputs {
    sigpos: i64,
    leaf: i64,
    assetSize: i64,
    assetSizeGreaterEqThan: i64,
    assetSizeLessThan: i64,
    assetSizeLabel: String,
    merkleProof: SpartanMerkleProof,
    nonceRaw: String,
    proofPubKey: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct MerkleSigPosRangeV1Data {
    prfs_set_id: String,
    range_data: RangeData,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct MerkleSigPosRangeV1PresetVals {
    nonceRaw: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct MerkleSigPosRangeV1PublicInputs {
    circuitPubInput: MerkleSigPosRangeV1CircuitPubInputs,
    nonceRaw: String,
    proofPubKey: String,
    assetSizeLabel: String,
    proofIdentityInput: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct MerkleSigPosRangeV1CircuitPubInputs {
    merkleRoot: i64,
    nonceInt: i64,
    proofPubKeyInt: i64,
    serialNo: i64,
    assetSizeGreaterEqThan: i64,
    assetSizeLessThan: i64,
}
