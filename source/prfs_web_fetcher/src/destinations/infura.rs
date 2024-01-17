use bytes::Buf;
use bytes::Bytes;
use http_body_util::BodyExt;
use http_body_util::Empty;
use http_body_util::Full;
use hyper::header::CONTENT_TYPE;
use hyper::Method;
use hyper::Request;
use hyper::Uri;
// use hyper_014::Uri;
use hyper_tls::HttpsConnector;
use hyper_util::rt::TokioIo;
use hyper_util::{client::legacy::Client, rt::TokioExecutor};
use hyper_utils::io::full;
use serde_json::json;
use tokio::io::{self, AsyncWriteExt as _};
use tokio::net::{TcpListener, TcpStream};

use crate::WebFetcherError;

pub async fn fetch_asset() -> Result<(), WebFetcherError> {
    println!("fetch()");

    let https = HttpsConnector::new();

    let client = Client::builder(TokioExecutor::new()).build::<_, Full<Bytes>>(https);

    // println!("Headers:\n{:#?}", res.headers());
    let url = Uri::from_static("https://mainnet.infura.io/v3/b92e8750d18a4bfa9d748d03807db92d");

    // let authority = url.authority().unwrap().clone();
    //
    let data = json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_blockNumber",
        "params": [],
    });

    let req = Request::builder()
        .uri(url)
        .method(Method::POST)
        .header(CONTENT_TYPE, "application/json")
        .body(Full::from(data.to_string()))?;

    let mut res = client.request(req).await.unwrap();
    println!("Status: {}", res.status());
    // let whole_body = res.collect().await.unwrap().aggregate();
    // let data: String = serde_json::from_reader(whole_body.reader()).unwrap();
    // // println!("d: {}", data);

    // // res.body_mut().with_current_subscriber

    while let Some(frame) = res.body_mut().frame().await {
        let frame = frame?;

        if let Some(d) = frame.data_ref() {
            io::stdout().write_all(d).await?;
        }
    }

    Ok(())
}
