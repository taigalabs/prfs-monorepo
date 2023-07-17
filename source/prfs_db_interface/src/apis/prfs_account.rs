use crate::{
    database::Database,
    models::{EthAccountTreeNode, EthTreeNode, ProofType},
    DbInterfaceError,
};
use rust_decimal::Decimal;
use std::{collections::BTreeMap, fs::write};
use tokio_postgres::{Client as PGClient, Row};

impl Database {
    pub async fn sign_up(&self, where_clause: &str) -> Result<Vec<String>, DbInterfaceError> {
        let stmt = format!(
            "SELECT * from {} where {}",
            Account::table_name(),
            where_clause
        );
        // println!("stmt: {}", stmt);

        let rows = match self.pg_client.query(&stmt, &[]).await {
            Ok(r) => r,
            Err(err) => {
                tracing::error!("account retrieval failed, err: {}, stmt: {}", err, stmt);

                return Err(err.into());
            }
        };

        let accounts: Vec<Account> = rows
            .iter()
            .map(|r| {
                let addr: String = r.try_get("addr").expect("addr should be present");
                let wei: Decimal = r.try_get("wei").expect("wei should be present");

                Account { addr, wei }
            })
            .collect();

        Ok(accounts)
    }
}
