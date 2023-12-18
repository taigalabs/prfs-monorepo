use hyper_utils::generate_api_error_codes;
use hyper_utils::ApiHandleErrorCode;
use native_json::json;
use serde::{Deserialize, Serialize};

// generate_api_error_codes! {
//     PrfsApiHandleErrorCode,
//     (2000000, SUCCESS, "Success");
//     (4000000, UNKNOWN_ERROR, "Unknown error");
//     (4000001, CANNOT_FIND_USER, "Can't find a user");
//     (4000002, USER_EXISTS, "User already exists");
//     (4000003, NO_POLICY_ATTACHED, "User has no policy attached");
// }

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct PrfsIdApiErrorCodes {
    pub UNKNOWN_ERROR: ApiHandleErrorCode,
    pub CANNOT_FIND_ID: ApiHandleErrorCode,
    pub ID_ALREADY_EXISTS: ApiHandleErrorCode,
}

lazy_static::lazy_static! {
    pub static ref API_ERROR_CODE: PrfsIdApiErrorCodes = {
        let error_codes_str = include_str!("../../data_api/error_codes.json");
        let ret: PrfsIdApiErrorCodes = serde_json::from_str(error_codes_str).unwrap();

        ret
    };
}
