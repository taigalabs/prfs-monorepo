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
