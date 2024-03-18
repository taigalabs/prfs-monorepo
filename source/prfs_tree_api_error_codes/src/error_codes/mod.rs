pub mod bindgen;

use prfs_axum_lib::generate_api_error_codes;
use prfs_axum_lib::ApiHandleErrorCode;
use serde::{Deserialize, Serialize};

generate_api_error_codes! {
    PrfsTreeApiErrorCodes,
    PRFS_TREE_API_ERROR_CODES,
    (String::from("20000000"), SUCCESS, "Success");
    (String::from("40000000"), UNKNOWN_ERROR, "Unknown error");
    (String::from("40000001"), CANNOT_FIND_ID, "Can't find id");
    (String::from("40000002"), ID_ALREADY_EXISTS, "Id already exists");
}
