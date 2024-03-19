pub mod bindgen;

use prfs_axum_lib::generate_api_error_codes;
use prfs_axum_lib::ApiHandleErrorCode;
use serde::{Deserialize, Serialize};

generate_api_error_codes! {
    PrfsAttestationApiErrorCodes,
    PRFS_ATST_API_ERROR_CODES,
    (String::from("20000000"), SUCCESS, "Success");
    (String::from("40000000"), UNKNOWN_ERROR, "Unknown error");
    (String::from("40000001"), TWITTER_ACC_VALIDATE_FAIL, "Twitter account validation fail");
    (String::from("40000002"), TWITTER_ACC_ATST_INSERT_FAIL, "Twitter account attestation insert fail");
    (String::from("40000A00"), INVALID_SIG, "Signature is invalid");
    (String::from("40000B00"), FETCH_CRYPTO_ASSET_FAIL, "Fetch crypto asset fail");
    (String::from("40000003"), CRYPTO_SIZE_UPSERT_FAIL, "Crypto size upsert fail");
}
