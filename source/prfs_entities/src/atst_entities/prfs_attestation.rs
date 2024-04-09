use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use strum_macros::{Display, EnumString};
use ts_rs::TS;

use super::prfs_atst_status::PrfsAtstStatus;
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
    pub value_num: String,
    pub atst_version: PrfsAtstVersion,
    pub value_raw: String,
}

#[allow(non_camel_case_types)]
#[derive(TS, Clone, Debug, Serialize, Deserialize, EnumString, Display)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsAtstMeta {
    crypto_asset(CryptoAssetMeta),
    group_member(GroupMemberAtstMeta),
}

#[derive(TS, Debug, Serialize, Deserialize, Default, Clone)]
#[ts(export)]
pub struct CryptoAssetMeta {
    pub assets: Vec<CryptoAsset>,
}

#[derive(TS, Debug, Serialize, Deserialize, Default, Clone)]
#[ts(export)]
pub struct GroupMemberAtstMeta {
    pub value_raw: String,
}
