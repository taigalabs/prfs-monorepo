use super::json::SetJson;
use crate::{envs::ENVS, TreeMakerError};
use colored::Colorize;
use prfs_db_interface::{
    database::Database,
    models::{PrfsSet, PrfsTreeNode},
};
use rust_decimal::{prelude::FromPrimitive, Decimal};
use std::time::SystemTime;

pub async fn create_leaves_without_offset(
    db: &Database,
    set_json: &SetJson,
    mut prfs_set: PrfsSet,
) -> Result<(), TreeMakerError> {
    let set_id = set_json.set.set_id.to_string();

    let set_insert_interval = ENVS.set_insert_interval;

    println!(
        "{} leaves without offset, set_id: {}, set_insert_interval: {}",
        "Creating".green(),
        set_id,
        set_insert_interval,
    );

    let mut count = 0;

    let where_clause = format!("{}", set_json.set.where_clause,);

    let now = SystemTime::now();
    let accounts = db.get_eth_accounts(&where_clause).await?;
    let elapsed = now.elapsed().unwrap();

    println!(
        "Query took {} ms - get_eth_accounts, row_count: {}",
        elapsed.as_millis(),
        accounts.len(),
    );

    if accounts.len() < 1 {
        println!("No account has been returned. Exiting...");

        return Ok(());
    }

    let mut nodes = vec![];

    for (idx, account) in accounts.iter().enumerate() {
        let node = PrfsTreeNode {
            pos_w: Decimal::from_u64((count + idx) as u64).unwrap(),
            pos_h: 0,
            val: account.addr.to_string(),
            set_id: set_id.to_string(),
        };

        nodes.push(node);
    }

    let nodes_updated = db.insert_prfs_tree_nodes(&nodes, false).await?;

    count += accounts.len();

    println!(
        "{} a set, set_id: {}, total count: {}, nodes_updated: {}",
        "Created".green(),
        set_id,
        count,
        nodes_updated,
    );

    prfs_set.cardinality = count as i64;

    db.insert_prfs_set(&prfs_set, true).await.unwrap();

    Ok(())
}
