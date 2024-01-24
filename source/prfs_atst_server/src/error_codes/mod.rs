use hyper_utils::generate_api_error_codes;
use hyper_utils::ApiHandleErrorCode;
use serde::{Deserialize, Serialize};

generate_api_error_codes! {
    PrfsAttestationApiErrorCodes,
    API_ERROR_CODE,
    (2000000, SUCCESS, "Success");
    (4000000, UNKNOWN_ERROR, "Unknown error");
    (4000001, TWITTER_ACC_VALIDATE_FAIL, "Twitter account validation fail");
    (4000002, TWITTER_ACC_ATST_INSERT_FAIL, "Twitter account attestation insert fail");
    (4000003, CRYPTO_SIZE_UPSERT_FAIL, "Crypto size upsert fail");
}
