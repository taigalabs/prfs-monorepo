use hyper_utils::{generate_api_error, resp::ApiHandleError};

// pub struct IdApiHandleError;

generate_api_error! {
    IdApiHandleError,
    (4000001, CANNOT_FIND_ID, "Can't find an ID");
    (4000002, ID_ALREADY_EXISTS, "ID already exists");
}
