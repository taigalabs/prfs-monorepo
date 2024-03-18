use serde::{Deserialize, Serialize};
use sqlx::Type;
use strum::{Display, EnumString, IntoStaticStr};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, Type, TS, Display)]
#[allow(non_camel_case_types)]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum PrfsAtstType {
    crypto_1,
}
