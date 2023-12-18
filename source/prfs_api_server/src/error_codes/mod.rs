use hyper_utils::generate_api_error_codes;
use hyper_utils::ApiHandleErrorCode;

generate_api_error_codes! {
    PrfsApiHandleErrorCode,
    (2000000, SUCCESS, "Success");
    (4000000, UNKNOWN_ERROR, "Unknown error");
    (4000001, CANNOT_FIND_USER, "Can't find a user");
    (4000002, USER_EXISTS, "User already exists");
    (4000003, NO_POLICY_ATTACHED, "User has no policy attached");
}
