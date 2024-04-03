use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{
    AddrMembershipV1Data, MerkleSigPosExactV1Data, MerkleSigPosRangeV1Data, SimpleHashV1Data,
};

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum CircuitTypeData {
    simple_hash_v1(SimpleHashV1Data),
    addr_membership_v1(AddrMembershipV1Data),
    merkle_sig_pos_range_v1(MerkleSigPosRangeV1Data),
    merkle_sig_pos_exact_v1(MerkleSigPosExactV1Data),
}
