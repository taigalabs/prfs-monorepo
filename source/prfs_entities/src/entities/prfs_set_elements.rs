use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsSetElement {
    pub name: String,
    pub set_id: String,
    #[ts(type = "Record<string, string>[]")]
    pub data: sqlx::types::Json<Vec<PrfsSetElementData>>,
    pub r#ref: Option<String>,
    pub status: PrfsSetElementStatus,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsSetElementData {
    pub label: String,
    pub r#type: PrfsSetElementDataType,
    pub val: String,
}

#[derive(TS, Clone, Debug, Serialize, Deserialize, sqlx::Type, EnumString, Display)]
#[ts(export)]
#[sqlx(type_name = "VARCHAR")]
pub enum PrfsSetElementStatus {
    Registered,
    NotRegistered,
}

#[derive(TS, Clone, Debug, Serialize, Deserialize, sqlx::Type, EnumString, Display)]
#[ts(export)]
#[sqlx(type_name = "VARCHAR")]
pub enum PrfsSetElementDataType {
    Hex32,
    Int,
}
