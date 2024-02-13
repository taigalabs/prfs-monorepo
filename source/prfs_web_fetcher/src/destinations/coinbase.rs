use bytes::Buf;
use bytes::Bytes;
use http_body_util::BodyExt;
use http_body_util::Full;
use hyper::header::CONTENT_TYPE;
use hyper::Method;
use hyper::Request;
use hyper::Uri;
use hyper_tls::HttpsConnector;
use hyper_util::{client::legacy::Client, rt::TokioExecutor};
use prfs_entities::atst_api::CoinbaseExchangeRates;
use serde::Deserialize;
use serde::Serialize;

use crate::WebFetcherError;

#[derive(Serialize, Deserialize, Debug)]
pub struct CoinbaseExchangeRatesResult {
    pub data: CoinbaseExchangeRates,
}

pub async fn get_exchange_rates<S: AsRef<str> + Serialize>(
    currency: S,
) -> Result<CoinbaseExchangeRatesResult, WebFetcherError> {
    let https = HttpsConnector::new();
    let client = Client::builder(TokioExecutor::new()).build::<_, Full<Bytes>>(https);
    let uri = Uri::builder()
        .scheme("https")
        .authority("api.coinbase.com")
        .path_and_query(format!("/v2/exchange-rates?currency={}", currency.as_ref()))
        .build()
        .unwrap();

    let req = Request::builder()
        .uri(&uri)
        .method(Method::GET)
        .header(CONTENT_TYPE, "application/json")
        .body(Full::from(""))?;
    let res = client.request(req).await.unwrap();
    let data = res.collect().await.unwrap().aggregate();

    let resp: CoinbaseExchangeRatesResult = serde_json::from_reader(data.reader()).unwrap();

    Ok(resp)
}
