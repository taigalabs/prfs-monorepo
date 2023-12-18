use std::{error::Error, fmt};

#[derive(Debug)]
struct ApiHandleError;

impl Error for ApiHandleError {}

impl fmt::Display for ApiHandleError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Oh no, something bad went down")
    }
}
