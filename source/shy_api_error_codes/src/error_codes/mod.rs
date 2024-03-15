pub mod bindgen;

use prfs_axum_lib::generate_api_error_codes;
use prfs_axum_lib::ApiHandleErrorCode;
use serde::{Deserialize, Serialize};

generate_api_error_codes! {
    ShyApiErrorCodes,
    SHY_API_ERROR_CODES,
    (String::from("20000000"), SUCCESS, "Success");
    (String::from("40000000"), UNKNOWN_ERROR, "Unknown error");
    (String::from("40000001"), BAD_URL, "Unable to make http requests (CLI) to this URL");
    (String::from("400000A0"), NOT_MACHING_SIG_MSG, "Signature might have been made on an invalid msg");
    (String::from("400000A1"), INVALID_SIG, "Signature is invalid");
    (String::from("400000C1"), CANNOT_FIND_USER, "Can't find a user");
    (String::from("400000C2"), SIGN_UP_FAIL, "Sign up failed");
    (String::from("40000B00"), RECORD_INSERT_FAIL, "Unable to insert the record");
    (String::from("40000B01"), TOPIC_PROOF_RETRIEVAL_FAIL, "Unable to retreive topic proof");
    (String::from("40000C01"), PUBLIC_KEY_NOT_MACHING, "Public key not matching");
}
