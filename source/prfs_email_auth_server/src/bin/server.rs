use google_gmail1::api::Message;
use google_gmail1::{chrono, hyper, hyper_rustls, oauth2, FieldMask, Gmail};
use google_gmail1::{Error, Result};
use std::default::Default;
use std::fs;

#[tokio::main]
async fn main() {
    func().await;
}

async fn func() {
    // Get an ApplicationSecret instance by some means. It contains the `client_id` and
    // `client_secret`, among other things.
    let secret: oauth2::ApplicationSecret = Default::default();
    // Instantiate the authenticator. It will choose a suitable authentication flow for you,
    // unless you replace  `None` with the desired Flow.
    // Provide your own `AuthenticatorDelegate` to adjust the way it operates and get feedback about
    // what's going on. You probably want to bring in your own `TokenStorage` to persist tokens and
    // retrieve them from storage.
    let auth = oauth2::InstalledFlowAuthenticator::builder(
        secret,
        oauth2::InstalledFlowReturnMethod::HTTPRedirect,
    )
    .build()
    .await
    .unwrap();

    let mut hub = Gmail::new(
        hyper::Client::builder().build(
            hyper_rustls::HttpsConnectorBuilder::new()
                .with_native_roots()
                .https_or_http()
                .enable_http1()
                .build(),
        ),
        auth,
    );
    // As the method needs a request, you would usually fill it with the desired information
    // into the respective structure. Some of the parts shown here might not be applicable !
    // Values shown here are possibly random and not representative !
    let mut req = Message::default();

    // You can configure optional parameters by calling the respective setters at will, and
    // execute the final call using `upload_resumable(...)`.
    // Values shown here are possibly random and not representative !
    let result = hub
        .users()
        .messages_import(req, "userId")
        .process_for_calendar(true)
        .never_mark_spam(true)
        .internal_date_source("Lorem")
        .deleted(false)
        .upload_resumable(
            fs::File::open("file.ext").unwrap(),
            "application/octet-stream".parse().unwrap(),
        )
        .await;

    match result {
        Err(e) => match e {
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
            | Error::JsonDecodeError(_, _) => println!("{}", e),
        },
        Ok(res) => println!("Success: {:?}", res),
    }
}
