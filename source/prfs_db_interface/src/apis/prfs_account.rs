use crate::{
    database::Database,
    models::{EthAccountTreeNode, EthTreeNode, PrfsAccount, ProofType},
    DbInterfaceError,
};
use rust_decimal::Decimal;
use std::{collections::BTreeMap, fs::write};
use tokio_postgres::{Client as PGClient, Row};

impl Database {
    pub async fn get_prfs_account(
        &self,
        where_clause: &str,
    ) -> Result<Vec<PrfsAccount>, DbInterfaceError> {
        let stmt = format!(
            "SELECT * from {} where {}",
            PrfsAccount::table_name(),
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

        let prfs_accounts: Vec<PrfsAccount> = rows
            .iter()
            .map(|r| {
                let sig: String = r.try_get("sig").expect("sig should be present");

                PrfsAccount { sig }
            })
            .collect();

        Ok(prfs_accounts)
    }
}
