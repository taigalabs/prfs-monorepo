use bytes::Buf;
use bytes::Bytes;
use http_body_util::BodyExt;
use http_body_util::Empty;
use http_body_util::Full;
use hyper::header::CONTENT_TYPE;
use hyper::Method;
use hyper::Request;
use hyper::Uri;
use hyper_tls::HttpsConnector;
use hyper_util::rt::TokioIo;
use hyper_util::{client::legacy::Client, rt::TokioExecutor};
use hyper_utils::io::full;
use rust_decimal::Decimal;
use serde::Deserialize;
use serde::Serialize;
use serde_json::json;
use tokio::io::{self, AsyncWriteExt as _};
use tokio::net::{TcpListener, TcpStream};

use crate::WebFetcherError;

#[derive(Serialize, Deserialize, Debug)]
pub struct InfuraResponse<D> {
    pub jsonrpc: String,
    pub id: u32,
    pub result: D,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CryptoAsset {
    wallet_addr: String,
    amount: String,
    unit: String,
}

pub async fn fetch_asset<S: AsRef<str> + Serialize>(wallet_addr: S) -> Result<(), WebFetcherError> {
    let https = HttpsConnector::new();
    let client = Client::builder(TokioExecutor::new()).build::<_, Full<Bytes>>(https);
    let url = Uri::from_static("https://mainnet.infura.io/v3/b92e8750d18a4bfa9d748d03807db92d");

    let get_block_height = json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_blockNumber",
        "params": [],
    });
    let req = Request::builder()
        .uri(&url)
        .method(Method::POST)
        .header(CONTENT_TYPE, "application/json")
        .body(Full::from(get_block_height.to_string()))?;
    let res = client.request(req).await.unwrap();
    let data = res.collect().await.unwrap().aggregate();
    let block_height: InfuraResponse<String> = serde_json::from_reader(data.reader()).unwrap();

    let get_balance = json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_getBalance",
        "params": [wallet_addr, "latest"],
    });
    println!("get_balance: {}", get_balance);
    let req = Request::builder()
        .uri(&url)
        .method(Method::POST)
        .header(CONTENT_TYPE, "application/json")
        .body(Full::from(get_balance.to_string()))?;
    let res = client.request(req).await.unwrap();
    let data = res.collect().await.unwrap().aggregate();
    let balance: InfuraResponse<String> = serde_json::from_reader(data.reader()).unwrap();
    println!("balaa: {:?}", balance);
    let balance = balance.result.trim_start_matches("0x");
    let bal = Decimal::from_str_radix(balance, 16).unwrap();
    println!("bal: {}", bal);

    Ok(())
}
