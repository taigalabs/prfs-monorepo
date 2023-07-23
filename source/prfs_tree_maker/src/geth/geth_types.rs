use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Block {
    pub difficulty: String,
    pub extraData: String,
    pub gasLimit: String,
    pub gasUsed: String,
    pub hash: String,

    #[serde(skip_deserializing)]
    pub logsBloom: String,
    pub miner: String,
    pub mixHash: String,
    pub nonce: String,
    pub number: String,
    pub parentHash: String,
    pub receiptsRoot: String,
    pub sha3Uncles: String,
    pub size: String,
    pub stateRoot: String,
    pub timestamp: String,
    pub totalDifficulty: String,
    pub transactions: Vec<Transaction>,
    pub transactionsRoot: String,
    pub uncles: Vec<String>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Transaction {
    pub blockHash: String,
    pub blockNumber: String,
    pub from: String,
    pub gas: String,
    pub gasPrice: String,
    pub hash: String,
    pub input: String,
    pub nonce: String,
    pub to: Option<String>,
    pub transactionIndex: String,
    pub value: String,

    #[serde(rename = "type")]
    pub kind: String,
    pub v: String,
    pub r: String,
    pub s: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct TransactionReceipt {
    pub blockHash: String,
    pub blockNumber: String,
    pub contractAddress: Option<String>,
    pub cumulativeGasUsed: String,
    pub effectiveGasPrice: String,
    pub from: String,
    pub gasUsed: String,
    pub logsBloom: String,

    #[serde(skip_deserializing)]
    pub logs: Option<HashMap<String, String>>,
    pub root: Option<String>,
    pub to: Option<String>,
    pub transactionHash: String,
    pub transactionIndex: String,

    #[serde(rename = "type")]
    pub kind: String,
}
