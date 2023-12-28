use hyper_utils::generate_api_error_codes;
use hyper_utils::ApiHandleErrorCode;
use serde::{Deserialize, Serialize};

generate_api_error_codes! {
    PrfsAttestationApiErrorCodes,
    API_ERROR_CODE,
    (2000000, SUCCESS, "Success");
    (4000000, UNKNOWN_ERROR, "Unknown error");
}
