use hyper::upgrade::Upgraded;
use hyper_util::rt::TokioIo;
use std::{collections::HashMap, sync::Arc};
use tokio::sync::Mutex;
use tungstenite::WebSocket;

pub type PeerMap = Arc<Mutex<HashMap<String, WebSocket<TokioIo<Upgraded>>>>>;
