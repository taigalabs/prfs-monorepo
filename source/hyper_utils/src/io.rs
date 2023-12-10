use http_body_util::{BodyExt, Empty, Full};
use hyper::body::{Buf, Bytes, Incoming};
use hyper::{Request, Response};
use serde::de::DeserializeOwned;
use std::fmt::Debug;

use crate::HyperUtilsError;

pub type BytesBoxBody = http_body_util::combinators::BoxBody<Bytes, hyper::Error>;
pub type ApiHandlerResult = Result<Response<BytesBoxBody>, HyperUtilsError>;

pub fn full<T: Into<Bytes>>(chunk: T) -> BytesBoxBody {
    Full::new(chunk.into())
        .map_err(|never| match never {})
        .boxed()
}

pub fn empty() -> BytesBoxBody {
    Empty::<Bytes>::new()
        .map_err(|never| match never {})
        .boxed()
}

pub async fn parse_req<T>(req: Request<Incoming>) -> T
where
    T: DeserializeOwned + Debug,
{
    let whole_body = req.collect().await.unwrap().aggregate();
    let data: T = serde_json::from_reader(whole_body.reader()).unwrap();
    data
}
