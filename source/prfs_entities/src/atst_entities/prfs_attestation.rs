use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};
use ts_rs::TS;

use super::{PrfsAtstStatus, PrfsAtstValue};
use crate::{atst_api::CryptoAsset, PrfsAtstGroupId, PrfsAtstVersion};

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsAttestation {
    pub atst_id: String,
    pub atst_group_id: PrfsAtstGroupId,
    pub label: String,
    pub cm: String,

    #[ts(type = "Record<string, string>")]
    pub meta: sqlx::types::Json<PrfsAtstMeta>,
    pub status: PrfsAtstStatus,

    #[ts(type = "Record<string, string>[]")]
    pub value: sqlx::types::Json<Vec<PrfsAtstValue>>,
    pub atst_version: PrfsAtstVersion,
}

#[allow(non_camel_case_types)]
#[derive(TS, Clone, Debug, Serialize, Deserialize, EnumString, Display)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsAtstMeta {
    crypto_asset(CryptoAssetMeta),
    plain_data(PlainDataAtstMeta),
}

#[derive(TS, Debug, Serialize, Deserialize, Default, Clone)]
#[ts(export)]
pub struct CryptoAssetMeta {
    pub assets: Vec<CryptoAsset>,
}

#[derive(TS, Debug, Serialize, Deserialize, Default, Clone)]
#[ts(export)]
pub struct PlainDataAtstMeta {
    pub values: Vec<PlainDataValue>,
}

#[derive(TS, Debug, Serialize, Deserialize, Default, Clone)]
#[ts(export)]
pub struct PlainDataValue {
    pub label: String,
    pub value_raw: String,
    pub meta: Option<String>,
}
