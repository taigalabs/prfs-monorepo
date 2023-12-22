use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{parse_req, ApiHandlerResult, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    PrfsIdentitySignInRequest, PrfsIdentitySignInResponse, PrfsIdentitySignUpRequest,
    PrfsIdentitySignUpResponse,
};
use prfs_entities::atst_api_entities::{ScrapeTwitterRequest, ScrapeTwitterResponse};
use prfs_entities::entities::PrfsIdentity;
use std::sync::Arc;
use tokio::net::TcpStream;

use crate::error_codes::API_ERROR_CODE;
use crate::AtstServerError;

pub async fn scrape_tweet(req: Request<Incoming>, state: Arc<ServerState>) -> ApiHandlerResult {
    let req: ScrapeTwitterRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    // let mut tx = pool.begin().await.unwrap();
    // let prfs_identity = PrfsIdentity {
    //     identity_id: req.identity_id.to_string(),
    //     avatar_color: req.avatar_color.to_string(),
    // };

    // let identity_id = db_apis::insert_prfs_identity(&mut tx, &prfs_identity)
    //     .await
    //     .map_err(|err| ApiHandleError::from(&API_ERROR_CODE.UNKNOWN_ERROR, err))?;

    // tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(ScrapeTwitterResponse { is_valid: false });

    return Ok(resp.into_hyper_response());
}

async fn fetch_url(url: hyper::Uri) -> Result<(), AtstServerError> {
    let host = url.host().expect("uri has no host");
    let port = url.port_u16().unwrap_or(80);
    let addr = format!("{}:{}", host, port);
    let stream = TcpStream::connect(addr).await?;
    let io = TokioIo::new(stream);

    let (mut sender, conn) = hyper::client::conn::http1::handshake(io).await?;
    tokio::task::spawn(async move {
        if let Err(err) = conn.await {
            println!("Connection failed: {:?}", err);
        }
    });

    let authority = url.authority().unwrap().clone();

    let req = Request::builder()
        .uri(url)
        .header(hyper::header::HOST, authority.as_str())
        .body(Empty::<Bytes>::new())?;

    let mut res = sender.send_request(req).await?;

    println!("Response: {}", res.status());
    println!("Headers: {:#?}\n", res.headers());

    // Stream the body, writing each chunk to stdout as we get it
    // (instead of buffering and printing at the end).
    while let Some(next) = res.frame().await {
        let frame = next?;
        if let Some(chunk) = frame.data_ref() {
            io::stdout().write_all(&chunk).await?;
        }
    }

    println!("\n\nDone!");

    Ok(())
}
