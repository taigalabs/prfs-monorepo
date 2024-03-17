use super::geth_types::Block;
use super::TransactionReceipt;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct GetBlockByNumberRequest<'a>(
    // block_no
    pub &'a str,
    pub bool,
);

#[derive(Serialize, Deserialize, Debug)]
pub struct GetBalanceRequest<'a>(
    // addr
    pub &'a str,
    pub &'a str,
);

#[derive(Serialize, Deserialize, Debug)]
pub struct GetTransactionReceiptRequest<'a>(
    // tx_hash
    pub &'a str,
);

#[derive(Serialize, Deserialize, Debug)]
pub struct GetBalanceResponse {
    pub jsonrpc: String,
    pub id: usize,
    pub result: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GetBlockResponse {
    pub jsonrpc: String,
    pub id: usize,
    pub result: Option<Block>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GetTransactionReceiptResponse {
    pub jsonrpc: String,
    pub id: usize,
    pub result: Option<TransactionReceipt>,
}
