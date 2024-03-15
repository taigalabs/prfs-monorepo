use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsIdentity {
    pub identity_id: String,
    pub public_key: String,
    pub identity_type: PrfsIdentityType,
    pub avatar_color: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type, TS)]
#[allow(non_camel_case_types)]
#[serde(rename_all = "snake_case")]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum PrfsIdentityType {
    SECP_256K1,
}
