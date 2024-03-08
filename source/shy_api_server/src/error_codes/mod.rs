use prfs_axum_lib::generate_api_error_codes;
use prfs_axum_lib::ApiHandleErrorCode;
use serde::{Deserialize, Serialize};

generate_api_error_codes! {
    PrfsAttestationApiErrorCodes,
    API_ERROR_CODE,
    (String::from("2000000"), SUCCESS, "Success");
    (String::from("4000000"), UNKNOWN_ERROR, "Unknown error");
    (String::from("4000001"), BAD_URL, "Unable to make http requests (CLI) to this URL");
}
