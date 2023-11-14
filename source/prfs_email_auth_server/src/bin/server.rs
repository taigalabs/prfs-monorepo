use google_gmail1::api::Message;
use google_gmail1::{chrono, hyper, hyper_rustls, oauth2, FieldMask, Gmail};
use google_gmail1::{Error, Result};
use hyper_tls::HttpsConnector;
use prfs_email_auth_server::paths::PATHS;
use std::default::Default;
use std::fs;

#[tokio::main]
async fn main() {
    func().await;
}

async fn func() {
    let service_account_key = oauth2::read_service_account_key(&PATHS.prfs_auth_key)
        .await
        .unwrap();

    let auth = oauth2::ServiceAccountAuthenticator::builder(service_account_key)
        .subject("elden@taigalabs.xyz")
        .build()
        .await
        .unwrap();

    let https = HttpsConnector::new();
    let client = hyper::Client::builder().build::<_, hyper::Body>(https);

    // Gmail
    let mut hub = Gmail::new(
        client,
        // hyper::Client::builder().build(
        //     hyper_tls::HttpsConnectorBuilder::new(), //     .with_native_roots()
        //                                              //     .https_or_http()
        //                                              //     .enable_http1()
        //                                              //     .build(),
        // ),
        auth,
    );

    println!("111");

    // You can configure optional parameters by calling the respective setters at will, and
    // execute the final call using `upload_resumable(...)`.
    // Values shown here are possibly random and not representative !
    let result = hub
        .users()
        .messages_list("me")
        .add_scopes(["https://mail.google.com"])
        .doit()
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
