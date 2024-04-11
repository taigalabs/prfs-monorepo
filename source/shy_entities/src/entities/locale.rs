use serde::{Deserialize, Serialize};
use sqlx::Type;
use strum_macros::{Display, EnumString};
use ts_rs::TS;

#[derive(
    Debug, Display, EnumString, Serialize, Deserialize, Clone, Type, TS, PartialEq, Eq, Hash,
)]
#[allow(non_camel_case_types)]
#[sqlx(type_name = "VARCHAR")]
pub enum Locale {
    ko,
    en,
}
