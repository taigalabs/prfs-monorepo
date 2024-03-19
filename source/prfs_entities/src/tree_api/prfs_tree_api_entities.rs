use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{
    GetPrfsSetElementRequest, GetPrfsSetElementResponse, GetPrfsSetElementsRequest,
    GetPrfsSetElementsResponse,
};
use crate::{ImportPrfsAttestationsToPrfsSetRequest, ImportPrfsAttestationsToPrfsSetResponse};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsTreeApiRequest {
    import_prfs_attestations_to_prfs_set(ImportPrfsAttestationsToPrfsSetRequest),
    get_prfs_set_elements(GetPrfsSetElementsRequest),
    get_prfs_set_element(GetPrfsSetElementRequest),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsTreeApiResponse {
    import_prfs_attestations_to_prfs_set(ImportPrfsAttestationsToPrfsSetResponse),
    get_prfs_set_elements(GetPrfsSetElementsResponse),
    get_prfs_set_element(GetPrfsSetElementResponse),
}
