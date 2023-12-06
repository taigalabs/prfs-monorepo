use http_body_util::BodyExt;
use hyper::Response;
use hyper::{
    body::{Buf, Incoming},
    Request,
};
use hyper_utils::io::BytesBoxBody;
use serde::de::DeserializeOwned;
use std::fmt::Debug;

use crate::ApiServerError;

// pub async fn parse_req<T>(req: Request<Incoming>) -> T
// where
//     T: DeserializeOwned + Debug,
// {
//     let whole_body = req.collect().await.unwrap().aggregate();
//     let data: T = serde_json::from_reader(whole_body.reader()).unwrap();
//     data
// }

pub type ApiHandlerResult = Result<Response<BytesBoxBody>, ApiServerError>;
