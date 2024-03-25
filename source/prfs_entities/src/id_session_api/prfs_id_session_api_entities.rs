use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{
    ClosePrfsIdSessionRequest, ClosePrfsIdSessionResponse, GetPrfsIdSessionValueRequest,
    GetPrfsIdSessionValueResponse, OpenPrfsIdSession2Request, OpenPrfsIdSession2Response,
    PutPrfsIdSessionValueRequest, PutPrfsIdSessionValueResponse,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdSessionApiRequest {
    open_prfs_id_session(OpenPrfsIdSession2Request),
    close_prfs_id_session(ClosePrfsIdSessionRequest),
    put_prfs_id_session_value(PutPrfsIdSessionValueRequest),
    get_prfs_id_session_value(GetPrfsIdSessionValueRequest),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdSessionApiResponse {
    open_prfs_id_session(OpenPrfsIdSession2Response),
    close_prfs_id_session(ClosePrfsIdSessionResponse),
    put_prfs_id_session_value(PutPrfsIdSessionValueResponse),
    get_prfs_id_session_value(GetPrfsIdSessionValueResponse),
}
