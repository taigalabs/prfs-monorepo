use prfs_axum_lib::generate_api_error_codes;
use prfs_axum_lib::ApiHandleErrorCode;
use serde::{Deserialize, Serialize};

generate_api_error_codes! {
    PrfsAttestationApiErrorCodes,
    API_ERROR_CODE,
    (String::from("20000000"), SUCCESS, "Success");
    (String::from("40000000"), UNKNOWN_ERROR, "Unknown error");
    (String::from("40000001"), BAD_URL, "Unable to make http requests (CLI) to this URL");
    (String::from("400000A0"), NOT_MACHING_SIG_MSG, "Signature might have been made on an invalid msg");
    (String::from("400000A1"), INVALID_SIG, "Signature is invalid");
}
