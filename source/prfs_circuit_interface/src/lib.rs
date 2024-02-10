use serde::{Deserialize, Serialize};
use sqlx::Type;
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type", rename_all = "snake_case")]
#[ts(export)]
pub enum CircuitTypeData {
    SimpleHashV1(HASH_DATA_V1),
    MerkleSigPosRangeV1(MERKLE_SIG_POS_RANGE_V1),
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_camel_case_types)]
#[ts(export)]
pub struct HASH_DATA_V1 {
    a: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_camel_case_types)]
#[ts(export)]
pub struct MERKLE_SIG_POS_RANGE_V1 {
    b: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type, TS)]
#[allow(non_camel_case_types)]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum CircuitTypeId {
    SIMPLE_HASH_V1,
    MERKLE_SIG_POS_RANGE_V1,
}
