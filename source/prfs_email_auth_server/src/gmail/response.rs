use google_gmail1::{chrono, hyper, oauth2, FieldMask, Gmail};
use google_gmail1::{Error, Result as GmailResult};

pub fn handle_resp<T>(
    result: GmailResult<(hyper::Response<hyper::body::Body>, T)>,
) -> GmailResult<(hyper::Response<hyper::body::Body>, T)> {
    match result {
        Err(ref e) => match e {
            // The Error enum provides details about what exactly happened.
            // You can also just use its `Debug`, `Display` or `Error` traits
            Error::HttpError(_)
            | Error::Io(_)
            | Error::MissingAPIKey
            | Error::MissingToken(_)
            | Error::Cancelled
            | Error::UploadSizeLimitExceeded(_, _)
            | Error::Failure(_)
            | Error::BadRequest(_)
            | Error::FieldClash(_)
            | Error::JsonDecodeError(_, _) => {
                println!("Error fetching emails {}", e);

                return result;
            }
        },
        Ok(ref _res) => {
            return result;
        }
    };
}
