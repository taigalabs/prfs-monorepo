use google_gmail1::api::Message;
use google_gmail1::{chrono, hyper, hyper_rustls, oauth2, FieldMask, Gmail};
use google_gmail1::{Error, Result};
use hyper_tls::HttpsConnector;
use std::fs;
use std::sync::Arc;

use crate::envs::ENVS;
use crate::paths::PATHS;
use crate::server::state::ServerState;

pub async fn run_gmail_auth(state: Arc<ServerState>) {
    let service_account_key = oauth2::read_service_account_key(&PATHS.prfs_auth_key)
        .await
        .unwrap();

    let auth = oauth2::ServiceAccountAuthenticator::builder(service_account_key)
        .subject(&ENVS.gmail_account)
        .build()
        .await
        .unwrap();

    let https = HttpsConnector::new();
    let client = hyper::Client::builder().build::<_, hyper::Body>(https);

    let mut hub = Gmail::new(client, auth);

    println!("Successfully created a gmail instance");

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

    // hub.users().watch()
}
