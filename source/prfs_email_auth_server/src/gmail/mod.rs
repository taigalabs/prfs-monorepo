mod response;

use google_gmail1::api::Message;
use google_gmail1::{chrono, hyper, hyper_rustls, oauth2, FieldMask, Gmail};
use google_gmail1::{Error, Result};
use hyper::client::HttpConnector;
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

    println!(
        "Successfully created a gmail instance, subject: {}",
        &ENVS.gmail_account
    );

    fetch_emails(hub).await;
}

async fn fetch_emails(hub: Gmail<HttpsConnector<HttpConnector>>) {
    let result = hub
        .users()
        .messages_list("me")
        .q("after:1388552400")
        .add_scopes(["https://mail.google.com"])
        .doit()
        .await;

    let (_, msg_response) = match result {
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
            | Error::JsonDecodeError(_, _) => {
                println!("Error fetching emails {}", e);
                return;
            }
        },
        Ok(res) => res,
    };

    let messages = if let Some(m) = msg_response.messages {
        m
    } else {
        println!("There is no message in the response!");
        return;
    };

    println!("messages len: {}", messages.len());

    for msg in messages {
        let msg_id = if let Some(id) = msg.id {
            id
        } else {
            continue;
        };

        println!("msg_id: {:?}", msg_id);

        let a = hub.users().messages_get("me", &msg_id).doit().await;
    }
}

pub fn handle_resp<T>(result: Result<(Response<hyper::body::Body>, T), Error>) {
    let (_, msg_response) = match result {
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
            | Error::JsonDecodeError(_, _) => {
                println!("Error fetching emails {}", e);
                return;
            }
        },
        Ok(res) => res,
    };
}
