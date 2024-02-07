use futures::stream::SplitSink;
use hyper::upgrade::Upgraded;
use hyper_util::rt::TokioIo;
use std::{collections::HashMap, sync::Arc};
use tokio::sync::Mutex;
use tokio_tungstenite::WebSocketStream;
use tungstenite::Message;

pub type PeerMap =
    Arc<Mutex<HashMap<String, Arc<Mutex<SplitSink<WebSocketStream<TokioIo<Upgraded>>, Message>>>>>>;
