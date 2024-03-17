use super::{
    GetBlockByNumberRequest, GetBlockResponse, GetTransactionReceiptRequest,
    GetTransactionReceiptResponse,
};
use crate::envs::ENVS;
use crate::geth::io_models::{GetBalanceRequest, GetBalanceResponse};
use crate::make_request_type;
use colored::Colorize;
use hyper_014::{client::HttpConnector, Body, Client as HyperClient, Method, Request};
use hyper_tls::HttpsConnector;

pub struct GethClient {
    pub hyper_client: HyperClient<HttpsConnector<HttpConnector>>,
    pub geth_endpoint: String,
}

#[allow(non_snake_case)]
impl GethClient {
    pub fn new(geth_endpoint: String) -> GethClient {
        println!(
            "{} Geth client, endpoint: {}",
            "Initializing".green(),
            geth_endpoint
        );

        let https = HttpsConnector::new();
        let hyper_client = HyperClient::builder().build::<_, hyper_014::Body>(https);

        GethClient {
            hyper_client,
            geth_endpoint,
        }
    }

    make_request_type!(eth_getBalance, GetBalanceRequest, GetBalanceResponse);
    make_request_type!(
        eth_getBlockByNumber,
        GetBlockByNumberRequest,
        GetBlockResponse
    );
    make_request_type!(
        eth_getTransactionReceipt,
        GetTransactionReceiptRequest,
        GetTransactionReceiptResponse
    );
}

#[macro_export]
macro_rules! make_request_type {
    ($fn_name:ident, $req_type:ident, $resp_type:ident) => {
        pub async fn $fn_name<'a>(
            &self,
            req_type: $req_type<'a>,
        ) -> Result<$resp_type, crate::TreeMakerError> {
            let method = stringify!($fn_name);

            let body = serde_json::json!(
                {
                    "jsonrpc":"2.0",
                    "method": method,
                    "params": req_type,
                    "id":1,
                }
            )
            .to_string();

            let req = match Request::builder()
                .method(Method::POST)
                .uri(&self.geth_endpoint)
                .header("content-type", "application/json")
                .body(Body::from(body)) {
                Ok(r) => r,
                Err(err) => {
                    let msg = format!("Error sending a request, err: {}", err);

                    tracing::error!("{}", msg);

                    return Err(msg.into());
                }
            };

            let resp = self.hyper_client.request(req).await?;
            let body = hyper_014::body::to_bytes(resp.into_body()).await?;

            let res: $resp_type = match serde_json::from_slice(&body) {
                Ok(r) => r,
                Err(err) => {
                    let msg = format!(
                        "Error deserializing {}, original body: {:?}, err: {}",
                        stringify!($resp_type), body, err,
                    );

                    tracing::error!("{}", msg);

                    return Err(msg.into());
                }
            };

            return Ok(res);
        }
    };
}
