use serde::{Deserialize, Serialize};
use sqlx::Type;
use strum_macros::{Display, EnumString};
use ts_rs::TS;

use super::Locale;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyChannel {
    pub channel_id: String,
    pub label: String,
    pub locale: Locale,
    pub desc: String,

    #[ts(type = "string[]")]
    pub proof_type_ids: sqlx::types::Json<Vec<String>>,

    pub status: ShyChannelStatus,
    pub r#type: ShyChannelType,
}

#[derive(
    Debug, Display, EnumString, Serialize, Deserialize, Clone, Type, TS, PartialEq, Eq, Hash,
)]
#[allow(non_camel_case_types)]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum ShyChannelStatus {
    Normal,
    Suspended,
}

#[derive(
    Debug, Display, EnumString, Serialize, Deserialize, Clone, Type, TS, PartialEq, Eq, Hash,
)]
#[allow(non_camel_case_types)]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum ShyChannelType {
    Open,
    Closed,
}
