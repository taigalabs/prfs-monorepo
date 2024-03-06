use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::entities::{EthAccount, PrfsAccount};
use rust_decimal::Decimal;
use std::collections::BTreeMap;

use crate::DbInterfaceError;

pub async fn get_eth_accounts(
    pool: &Pool<Postgres>,
    where_clause: &str,
) -> Result<Vec<EthAccount>, DbInterfaceError> {
    let query = format!("SELECT * from eth_accounts as acc {}", where_clause);

    let rows = sqlx::query(&query).fetch_all(pool).await.unwrap();

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
    tx: &mut Transaction<'_, Postgres>,
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

    let result = sqlx::query(&query).execute(&mut **tx).await.unwrap();

    return Ok(result.rows_affected());
}
