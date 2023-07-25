use crate::{database::Database, models::EthAccount, DbInterfaceError};
use rust_decimal::Decimal;
use std::collections::BTreeMap;

impl Database {
    pub async fn get_eth_accounts(
        &self,
        where_clause: &str,
    ) -> Result<Vec<EthAccount>, DbInterfaceError> {
        let stmt = format!(
            "SELECT * from {} as acc {}",
            EthAccount::table_name(),
            where_clause,
        );
        println!("stmt: {}", stmt);

        let rows = match self.pg_client.query(&stmt, &[]).await {
            Ok(r) => r,
            Err(err) => {
                tracing::error!("account retrieval failed, err: {}, stmt: {}", err, stmt);

                return Err(err.into());
            }
        };

        let accounts: Vec<EthAccount> = rows
            .iter()
            .map(|r| {
                let addr: String = r.try_get("addr").expect("addr should be present");
                let wei: Decimal = r.try_get("wei").expect("wei should be present");

                EthAccount { addr, wei }
            })
            .collect();

        Ok(accounts)
    }

    pub async fn insert_eth_accounts(
        &self,
        balances: BTreeMap<String, EthAccount>,
        update_on_conflict: bool,
    ) -> Result<u64, DbInterfaceError> {
        let mut values = Vec::with_capacity(balances.len());
        for (_, acc) in balances {
            let val = format!("('{}', {})", acc.addr, acc.wei);
            values.push(val);
        }

        let stmt = if update_on_conflict {
            format!(
                "INSERT INTO {} (addr, wei) VALUES {} ON CONFLICT(addr) {}",
                EthAccount::table_name(),
                values.join(","),
                "DO UPDATE SET wei = excluded.wei, updated_at = now()",
            )
        } else {
            format!(
                "INSERT INTO {} (addr, wei) VALUES {} ON CONFLICT DO NOTHING",
                EthAccount::table_name(),
                values.join(",")
            )
        };
        // println!("stmt: {}", stmt);

        let rows_updated = match self.pg_client.execute(&stmt, &[]).await {
            Ok(r) => r,
            Err(err) => {
                tracing::error!("Error executing stmt, err: {}, stmt: {}", err, stmt);

                return Err(err.into());
            }
        };

        Ok(rows_updated)
    }
}
