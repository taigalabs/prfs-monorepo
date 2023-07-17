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

impl Database {
    pub async fn get_accounts(
        &self,
        where_clause: &str,
    ) -> Result<Vec<EthAccount>, DbInterfaceError> {
        let stmt = format!(
            "SELECT * from {} where {}",
            EthAccount::table_name(),
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

    pub async fn get_eth_tree_nodes(
        &self,
        where_clause: &str,
    ) -> Result<Vec<EthTreeNode>, DbInterfaceError> {
        let stmt = format!(
            "SELECT * from {} where {}",
            EthTreeNode::table_name(),
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

        let nodes: Vec<EthTreeNode> = rows
            .iter()
            .map(|n| {
                let pos_w = n.try_get("pos_w").expect("pos_w should exist");
                let pos_h = n.try_get("pos_h").expect("pos_h should exist");
                let val = n.try_get("val").expect("val should exist");
                let set_id = n.try_get("set_id").expect("set_id should exist");

                EthTreeNode {
                    pos_w,
                    pos_h,
                    val,
                    set_id,
                }
            })
            .collect();

        Ok(nodes)
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

    pub async fn insert_eth_tree_nodes(
        &self,
        nodes: &Vec<EthTreeNode>,
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
                EthTreeNode::table_name(),
                values.join(","),
                "DO UPDATE SET val = excluded.val, updated_at = now()",
            )
        } else {
            format!(
                "INSERT INTO {} (pos_w, pos_h, val, set_id) VALUES {} ON CONFLICT DO NOTHING",
                EthTreeNode::table_name(),
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

    pub async fn insert_eth_account_tree_nodes(
        &self,
        account_nodes: &Vec<EthAccountTreeNode>,
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
                EthAccountTreeNode::table_name(),
                values.join(","),
                "DO UPDATE SET addr=excluded.addr, set_id=excluded.set_id, updated_at=now()",
            )
        } else {
            format!(
                "INSERT INTO {} (addr, set_id) VALUES {} ON CONFLICT DO NOTHING returning addr",
                EthAccountTreeNode::table_name(),
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
