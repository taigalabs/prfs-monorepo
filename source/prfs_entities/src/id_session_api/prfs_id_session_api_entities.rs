use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{
    GetPrfsIdSessionValueRequest, GetPrfsIdSessionValueResponse, PutPrfsIdSessionValueRequest,
    PutPrfsIdSessionValueResponse,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdSessionApiRequest {
    put_prfs_id_session_value(PutPrfsIdSessionValueRequest),
    get_prfs_id_session_value(GetPrfsIdSessionValueRequest),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdSessionApiResponse {
    put_prfs_id_session_value(PutPrfsIdSessionValueResponse),
    get_prfs_id_session_value(GetPrfsIdSessionValueResponse),
}
