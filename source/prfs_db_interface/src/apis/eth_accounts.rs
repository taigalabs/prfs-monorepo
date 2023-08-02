use crate::{
    database2::Database2,
    entities::{EthAccount, PrfsAccount},
    DbInterfaceError,
};
use rust_decimal::Decimal;
use sqlx::Row;
use std::collections::BTreeMap;

impl Database2 {
    pub async fn get_eth_accounts(
        &self,
        where_clause: &str,
    ) -> Result<Vec<EthAccount>, DbInterfaceError> {
        // let stmt = format!(
        //     "SELECT * from {} as acc {}",
        //     EthAccount::table_name(),
        //     where_clause,
        // );
        // println!("stmt: {}", stmt);

        // let rows = match self.pg_client.query(&stmt, &[]).await {
        //     Ok(r) => r,
        //     Err(err) => {
        //         tracing::error!("account retrieval failed, err: {}, stmt: {}", err, stmt);

        //         return Err(err.into());
        //     }
        // };

        // let accounts: Vec<EthAccount> = rows
        //     .iter()
        //     .map(|r| {
        //         let addr: String = r.try_get("addr").expect("addr should be present");
        //         let wei: Decimal = r.try_get("wei").expect("wei should be present");

        //         EthAccount { addr, wei }
        //     })
        //     .collect();

        let query = format!("SELECT * from eth_accounts as acc {}", where_clause);

        let rows = sqlx::query(&query).fetch_all(&self.pool).await.unwrap();

        let eth_accounts: Vec<EthAccount> = rows
            .iter()
            .map(|r| {
                let addr: String = r.try_get("addr").expect("addr should be present");
                let wei: Decimal = r.try_get("wei").expect("wei should be present");

                EthAccount { addr, wei }
            })
            .collect();

        Ok(eth_accounts)
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

        let query = if update_on_conflict {
            format!(
                "INSERT INTO eth_accounts (addr, wei) VALUES {} ON CONFLICT(addr) {}",
                values.join(","),
                "DO UPDATE SET wei = excluded.wei, updated_at = now()",
            )
        } else {
            format!(
                "INSERT INTO eth_accounts (addr, wei) VALUES {} ON CONFLICT DO NOTHING",
                values.join(",")
            )
        };
        // println!("stmt: {}", stmt);

        let result = sqlx::query(&query).execute(&self.pool).await.unwrap();

        return Ok(result.rows_affected());

        // let rows_updated = match self.pg_client.execute(&stmt, &[]).await {
        //     Ok(r) => r,
        //     Err(err) => {
        //         tracing::error!("Error executing stmt, err: {}, stmt: {}", err, stmt);

        //         return Err(err.into());
        //     }
        // };

        // Ok(rows_updated)
    }
}
