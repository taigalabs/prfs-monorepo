use super::models::Account;
use crate::{
    database::Database,
    models::{AccountNode, Node, ProofType},
    DbInterfaceError,
};
use rust_decimal::Decimal;
use std::io::Write;
use std::{collections::BTreeMap, fs::write};
use tokio_postgres::{Client as PGClient, Row};

impl Database {
    pub async fn get_accounts(&self, where_clause: &str) -> Result<Vec<Account>, DbInterfaceError> {
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

    pub async fn get_nodes(&self, where_clause: &str) -> Result<Vec<Row>, DbInterfaceError> {
        let stmt = format!(
            "SELECT * from {} where {}",
            Node::table_name(),
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

        Ok(rows)
    }

    pub async fn get_proof_types(&self) -> Result<Vec<Row>, DbInterfaceError> {
        let stmt = format!("SELECT * from {}", ProofType::table_name(),);
        // println!("stmt: {}", stmt);

        let rows = match self.pg_client.query(&stmt, &[]).await {
            Ok(r) => r,
            Err(err) => {
                tracing::error!("account retrieval failed, err: {}, stmt: {}", err, stmt);

                return Err(err.into());
            }
        };

        Ok(rows)
    }

    pub async fn insert_accounts(
        &self,
        balances: BTreeMap<String, Account>,
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
                Account::table_name(),
                values.join(","),
                "DO UPDATE SET wei = excluded.wei, updated_at = now()",
            )
        } else {
            format!(
                "INSERT INTO {} (addr, wei) VALUES {} ON CONFLICT DO NOTHING",
                Account::table_name(),
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

    pub async fn insert_nodes(
        &self,
        nodes: &Vec<Node>,
        update_on_conflict: bool,
    ) -> Result<u64, DbInterfaceError> {
        let mut values = Vec::with_capacity(nodes.len());

        for n in nodes {
            let val = format!("({}, {}, '{}', '{}')", n.pos_w, n.pos_h, n.val, n.set_id);
            values.push(val);
        }

        let stmt = if update_on_conflict {
            format!(
                "INSERT INTO {} (pos_w, pos_h, val, set_id) VALUES {} ON CONFLICT \
                    (pos_w, pos_h, set_id) {}",
                Node::table_name(),
                values.join(","),
                "DO UPDATE SET val = excluded.val, updated_at = now()",
            )
        } else {
            format!(
                "INSERT INTO {} (pos_w, pos_h, val, set_id) VALUES {} ON CONFLICT DO NOTHING",
                Node::table_name(),
                values.join(","),
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

    pub async fn insert_account_nodes(
        &self,
        account_nodes: &Vec<AccountNode>,
        update_on_conflict: bool,
    ) -> Result<u64, DbInterfaceError> {
        let mut values = Vec::with_capacity(account_nodes.len());

        for n in account_nodes {
            let val = format!("('{}', '{}')", n.addr, n.set_id,);
            values.push(val);
        }

        let stmt = if update_on_conflict {
            format!(
                "INSERT INTO {} (addr, set_id) VALUES {} ON CONFLICT \
                    (addr, set_id) {}",
                AccountNode::table_name(),
                values.join(","),
                "DO UPDATE SET addr=excluded.addr, set_id=excluded.set_id, updated_at=now()",
            )
        } else {
            format!(
                "INSERT INTO {} (addr, set_id) VALUES {} ON CONFLICT DO NOTHING returning addr",
                AccountNode::table_name(),
                values.join(","),
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

        // if rows_updated as usize != account_nodes.len() {
        //     println!("conflict stmt: {}", stmt);
        // }

        Ok(rows_updated)
    }
}
