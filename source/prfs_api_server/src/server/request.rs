use http_body_util::BodyExt;

use hyper::{
    body::{self, Buf, Incoming},
    Request,
};
use hyper_utils::io::BytesBoxBody;
use serde::de::DeserializeOwned;
use std::{fmt::Debug, sync::Arc};

pub async fn parse_req<T>(req: Request<Incoming>) -> T
where
    T: DeserializeOwned + Debug,
{
    let whole_body = req.collect().await.unwrap().aggregate();
    // Decode as JSON...
    let data: T = serde_json::from_reader(whole_body.reader()).unwrap();

    // let bytes = body::to_bytes(req.into_body()).await.unwrap();
    // let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    // let req: T = serde_json::from_str(&body_str).expect("req request should be parsable");

    // println!("req: {:?}", req);

    data
}
