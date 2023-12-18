use hyper_utils::generate_api_error;
use hyper_utils::resp::ApiHandleError;

generate_api_error! {
    PrfsApiHandleError,
    (2000000, SUCCESS, "Success");
    (4000001, CANNOT_FIND_USER, "Can't find a user");
}
