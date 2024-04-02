use serde::{Deserialize, Serialize};
use sqlx::Type;
use strum_macros::Display;
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, Type, TS, Display, PartialEq, Eq, Hash)]
#[allow(non_camel_case_types)]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum PrfsAtstTypeId {
    crypto_1,
    nonce_seoul_1,
}
