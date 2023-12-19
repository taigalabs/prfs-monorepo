use hyper_utils::generate_api_error_codes;
use hyper_utils::ApiHandleErrorCode;
use native_json::json;
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

// #[allow(non_snake_case)]
// #[derive(Serialize, Deserialize)]
// pub struct PrfsApiErrorCodes {
//     pub UNKNOWN_ERROR: ApiHandleErrorCode,
//     pub CANNOT_FIND_USER: ApiHandleErrorCode,
//     pub USER_ALREADY_EXISTS: ApiHandleErrorCode,
//     pub NO_POLICY_ATTACHED: ApiHandleErrorCode,
// }

// lazy_static::lazy_static! {
//     pub static ref API_ERROR_CODES: PrfsApiErrorCodes = {
//         // let error_codes_str = include_str!("../../data_api/error_codes.json");

//         let ret: PrfsApiErrorCodes = PrfsApiErrorCodes {
//             UNKNOWN_ERROR: ApiHandleErrorCode {
//                 code: 4000000,
//                 phrase: String::from("Unknown error")
//             },
//             CANNOT_FIND_USER: ApiHandleErrorCode {
//                 code: 4000001,
//                 phrase: String::from("Can't find a user"),
//             },
//             USER_ALREADY_EXISTS: ApiHandleErrorCode {
//                 code: 4000002,
//                 phrase: String::from("User already exists"),
//             },
//             NO_POLICY_ATTACHED: ApiHandleErrorCode {
//                 code: 4000003,
//                 phrase: String::from("User has no policy attached"),
//             },
//         };

//         ret
//     };
// }
