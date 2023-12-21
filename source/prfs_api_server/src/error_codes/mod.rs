use hyper_utils::generate_api_error_codes;
use hyper_utils::ApiHandleErrorCode;
use serde::{Deserialize, Serialize};

generate_api_error_codes! {
    PrfsApiErrorCodes,
    API_ERROR_CODES,
    (2000000, SUCCESS, "Success");
    (4000000, UNKNOWN_ERROR, "Unknown error");
    (4000001, CANNOT_FIND_USER, "Can't find a user");
    (4000002, USER_ALREADY_EXISTS, "User already exists");
    (4000003, NO_POLICY_ATTACHED, "User has no policy attached");
}
