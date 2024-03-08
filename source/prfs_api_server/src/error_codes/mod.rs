use prfs_axum_lib::generate_api_error_codes;
use prfs_axum_lib::ApiHandleErrorCode;
use serde::{Deserialize, Serialize};

generate_api_error_codes! {
    PrfsApiErrorCodes,
    API_ERROR_CODES,
    (String::from("2000000"), SUCCESS, "Success");
    (String::from("4000000"), UNKNOWN_ERROR, "Unknown error");
    (String::from("4000001"), CANNOT_FIND_USER, "Can't find a user");
    (String::from("4000002"), USER_ALREADY_EXISTS, "User already exists");
    (String::from("4000003"), NO_POLICY_ATTACHED, "User has no policy attached");
}
