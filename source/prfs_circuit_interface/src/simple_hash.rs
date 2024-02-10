use serde::{Deserialize, Serialize};
use sqlx::Type;
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct SimpleHashV1Inputs {}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct SimpleHashV1Data {}
