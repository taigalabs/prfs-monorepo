use serde::{Deserialize, Serialize};
use sqlx::Type;
use strum_macros::{Display, EnumString};
use ts_rs::TS;

#[derive(
    Debug, Display, EnumString, Serialize, Deserialize, Clone, Type, TS, PartialEq, Eq, Hash,
)]
#[allow(non_camel_case_types)]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum CircuitTypeId {
    simple_hash_v1,
    addr_membership_v1,
    merkle_sig_pos_range_v1,
    merkle_sig_pos_exact_v1,
}
