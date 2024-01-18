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
use hyper_util::{client::legacy::Client, rt::TokioExecutor};
use hyper_utils::io::full;
use prfs_entities::atst_api_entities::CryptoAsset;
use rust_decimal::Decimal;
use serde::Deserialize;
use serde::Serialize;
use serde_json::json;

use crate::WebFetcherError;

#[derive(Serialize, Deserialize, Debug)]
pub struct InfuraResponse<D> {
    pub jsonrpc: String,
    pub id: u32,
    pub result: Option<D>,
    pub error: Option<InfuraError>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct InfuraError {
    code: i32,
    message: String,
}

pub async fn fetch_asset<S: AsRef<str> + Serialize>(
    wallet_addr: S,
) -> Result<CryptoAsset, WebFetcherError> {
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

    if let Some(err) = block_height.error {
        return Err(format!("Failed to get block height, err: {:?}", err).into());
    }

    let get_balance = json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_getBalance",
        "params": [wallet_addr, block_height.result.unwrap()],
    });
    // println!("get_balance: {}", get_balance);
    let req = Request::builder()
        .uri(&url)
        .method(Method::POST)
        .header(CONTENT_TYPE, "application/json")
        .body(Full::from(get_balance.to_string()))?;
    let res = client.request(req).await.unwrap();
    let data = res.collect().await.unwrap().aggregate();
    let balance: InfuraResponse<String> = serde_json::from_reader(data.reader()).unwrap();

    if let Some(err) = balance.error {
        return Err(format!("Failed to get eth balance, err: {:?}", err).into());
    }

    let b = balance.result.ok_or("Failed to get eth balance")?;
    let balance = b.trim_start_matches("0x");
    let bal = Decimal::from_str_radix(balance, 16).unwrap();

    let asset = CryptoAsset {
        wallet_addr: String::from(wallet_addr.as_ref()),
        amount: bal,
        unit: "wei".to_string(),
    };

    Ok(asset)
}
