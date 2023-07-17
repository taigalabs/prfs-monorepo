mod eth;
mod prfs_account;

use super::models::EthAccount;
use crate::{
    database::Database,
    models::{EthAccountTreeNode, EthTreeNode, ProofType},
    DbInterfaceError,
};
use rust_decimal::Decimal;
use std::{collections::BTreeMap, fs::write};
use tokio_postgres::{Client as PGClient, Row};
