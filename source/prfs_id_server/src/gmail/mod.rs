mod response;

use google_gmail1::api::Message;
use google_gmail1::{chrono, hyper, hyper_rustls, oauth2, FieldMask, Gmail};
use google_gmail1::{Error, Result as GmailResult};
use hyper::client::HttpConnector;
use hyper_tls_05::HttpsConnector;
use std::fs;
use std::sync::Arc;

use crate::envs::ENVS;
use crate::gmail::response::handle_resp;
use crate::paths::PATHS;
use crate::server::state::ServerState;
use crate::vendors::get_vendor;

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
    let client = hyper_014::Client::builder().build::<_, hyper_014::Body>(https);

    let mut hub = Gmail::new(client, auth);

    println!(
        "Successfully created a gmail instance, subject: {}",
        &ENVS.gmail_account
    );

    // fetch_emails(hub).await;
}

async fn fetch_emails(hub: Gmail<HttpsConnector<HttpConnector>>) {
    let result = hub
        .users()
        .messages_list("me")
        .q("after:1388552400")
        .add_scope("https://mail.google.com")
        .doit()
        .await;

    let (_, msg_response) = handle_resp(result).unwrap();

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

        let result = hub
            .users()
            .messages_get("me", &msg_id)
            .add_scope("https://mail.google.com")
            .doit()
            .await;

        if let Ok((_, msg_response)) = handle_resp(result) {
            println!("raw: {:?}", msg_response.raw);

            // // println!("msg: {:?}", msg_response);
            // let payload = if let Some(p) = msg_response.payload {
            //     p
            // } else {
            //     continue;
            // };
            //

            match get_vendor(msg_response) {
                _ => {}
            };

            // if let Some(r) = msg_response.raw {
            //     let raw = String::from_utf8(r).unwrap();
            //     println!("raw: {}", raw);
            // }
        } else {
        };
    }
}
