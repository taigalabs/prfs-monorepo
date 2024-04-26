use chrono::{DateTime, Utc};
use prfs_circuit_interface::circuit_types::{
    CircuitTypeData, CircuitTypeId, MerkleSigPosExactV1Data, MerkleSigPosRangeV1Data, RangeData,
    RangeOption, SimpleHashV1Data,
};
use prfs_circuits_circom::CircuitBuildJson;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_entities::{PrfsAtstGroup, PrfsProofType};
use prfs_rust_utils::{markdown::read_md_file, serde::read_json_file};
use std::str::FromStr;

use crate::paths::PATHS;

pub fn load_prfs_atst_groups() -> Vec<PrfsAtstGroup> {
    let ret = vec![PrfsAtstGroup {
        atst_group_id: prfs_entities::PrfsAtstGroupId::nonce_seoul_1,
        label: "Nonce community Seoul".to_string(),
        desc: "Nonce Community Seoul".to_string(),
    }];

    return ret;
}
