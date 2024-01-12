use bytes::Bytes;
use http_body_util::BodyExt;
use http_body_util::Empty;
use hyper::Request;
use hyper::Uri;
use hyper_tls::HttpsConnector;
use hyper_util::rt::TokioIo;
use hyper_util::{client::legacy::Client, rt::TokioExecutor};
use tokio::io::{self, AsyncWriteExt as _};
use tokio::net::{TcpListener, TcpStream};

use crate::TLSRelayError;

pub async fn fetch() -> Result<(), TLSRelayError> {
    println!("fetch()");

    // let https = HttpsConnector::new();

    // let client = Client::builder(TokioExecutor::new()).build::<_, Empty<Bytes>>(https);

    // let mut res = client.get("https://hyper.rs".parse()?).await?;

    // println!("Status: {}", res.status());
    // println!("Headers:\n{:#?}", res.headers());

    // while let Some(frame) = res.body_mut().frame().await {
    //     let frame = frame?;

    //     if let Some(d) = frame.data_ref() {
    //         io::stdout().write_all(d).await?;
    //     }
    //
    let url: Uri = "https://hyper.rs".parse().unwrap();
    let host = url.host().expect("uri has no host");

    let port = url.port_u16().unwrap_or(80);
    let addr = format!("{}:{}", host, port);
    let stream = TcpStream::connect(addr).await?;

    // Use an adapter to access something implementing `tokio::io` traits as if they implement
    // `hyper::rt` IO traits.
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
