use http_body_util::{BodyExt, Empty};
use hyper_tls::HttpsConnector;
use hyper_util::client::legacy::Client;
use hyper_util::rt::{TokioExecutor, TokioIo};
use hyper_utils::io::{empty, parse_req, ApiHandlerResult, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use std::sync::Arc;
use tokio::io::AsyncWriteExt;
use tokio::net::TcpStream;

use crate::WebScraperError;

pub async fn scrape_tweet(tweet_url: String) -> Result<(), WebScraperError> {
    // let req: ScrapeTwitterRequest = parse_req(req).await;
    // let pool = &state.db2.pool;

    let url = "https://twitter.com/elonmusk";
    let url = url.parse::<hyper::Uri>().unwrap();

    let https = HttpsConnector::new();
    let client = Client::builder(TokioExecutor::new()).build::<_, Empty<hyper::body::Bytes>>(https);

    let mut res = client.get(url).await.unwrap();
    let whole_body = res.collect().await.unwrap();
    let b = whole_body.to_bytes();

    // let data: String = serde_json::from_reader(whole_body.reader()).unwrap();
    println!("data: {:?}", b);
    // String::from_utf8(whole_body.to_bytes()).unwrap();

    // while let Some(frame) = res.body_mut().frame().await {
    //     let frame = frame.unwrap();

    //     if let Some(d) = frame.data_ref() {
    //         tokio::io::stdout().write_all(d).await.unwrap();
    //     }
    // }

    Ok(())
}
