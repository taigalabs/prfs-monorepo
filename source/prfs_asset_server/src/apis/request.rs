use hyper::{body, Body, Request};
use serde::de::DeserializeOwned;
use std::{fmt::Debug, sync::Arc};

// pub async fn parse_req<T>(req: Request<Body>) -> T
// where
//     T: DeserializeOwned + Debug,
// {
//     let bytes = body::to_bytes(req.into_body()).await.unwrap();
//     let body_str = String::from_utf8(bytes.to_vec()).unwrap();
//     let req: T = serde_json::from_str(&body_str).expect("req request should be parsable");

//     println!("req: {:?}", req);

//     req
// }
