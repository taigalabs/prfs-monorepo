use prfs_axum_lib::generate_api_error_codes;
use prfs_axum_lib::ApiHandleErrorCode;
use serde::{Deserialize, Serialize};

generate_api_error_codes! {
    PrfsIdSessionApiErrorCodes,
    API_ERROR_CODES,
    (String::from("2000000"), SUCCESS, "Success");
    (String::from("4000000"), UNKNOWN_ERROR, "Unknown error");
    (String::from("4000001"), SESSION_NOT_EXISTS, "Can't find a session");
    (String::from("4000002"), USER_ALREADY_EXISTS, "User already exists");
    (String::from("4000003"), NO_POLICY_ATTACHED, "User has no policy attached");
}

lazy_static::lazy_static! {
    pub static ref API_ERROR_CODE: PrfsIdSessionApiErrorCodes = {
        let error_codes_str = include_str!("../../data_api/error_codes.json");
        let ret: PrfsIdSessionApiErrorCodes = serde_json::from_str(error_codes_str)
            .expect("Error code json needs to be loaded");

        ret
    };
}
