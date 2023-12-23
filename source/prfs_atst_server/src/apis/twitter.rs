use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{empty, parse_req, ApiHandlerResult, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::db_apis;
use prfs_entities::atst_api_entities::{ScrapeTwitterRequest, ScrapeTwitterResponse};
use prfs_web_scraper::destinations::twitter;
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODE;
use crate::AtstServerError;

pub async fn scrape_tweet(req: Request<Incoming>, state: Arc<ServerState>) -> ApiHandlerResult {
    let req: ScrapeTwitterRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let twitter_scrape = twitter::scrape_tweet(&req.tweet_url, &req.twitter_handle)
        .await
        .unwrap();

    // let url = "https://twitter.com/elonmusk";
    // let url = url.parse::<hyper::Uri>().unwrap();

    // let https = HttpsConnector::new();
    // let client = Client::builder(TokioExecutor::new()).build::<_, Empty<hyper::body::Bytes>>(https);

    // let mut res = client.get(url).await.unwrap();
    // let whole_body = res.collect().await.unwrap();
    // let b = whole_body.to_bytes();

    // // let data: String = serde_json::from_reader(whole_body.reader()).unwrap();
    // println!("data: {:?}", b);
    // String::from_utf8(whole_body.to_bytes()).unwrap();

    // while let Some(frame) = res.body_mut().frame().await {
    //     let frame = frame.unwrap();

    //     if let Some(d) = frame.data_ref() {
    //         tokio::io::stdout().write_all(d).await.unwrap();
    //     }
    // }

    let resp = ApiResponse::new_success(ScrapeTwitterResponse { is_valid: false });

    return Ok(resp.into_hyper_response());
}
