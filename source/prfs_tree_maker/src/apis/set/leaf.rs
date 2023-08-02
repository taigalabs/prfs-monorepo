use super::json::SetJson;
use crate::{envs::ENVS, TreeMakerError};
use colored::Colorize;
use prfs_db_interface::{
    database::Database,
    database2::Database2,
    entities::{PrfsSet, PrfsTreeNode},
};
use rust_decimal::{prelude::FromPrimitive, Decimal};
use std::time::SystemTime;

pub async fn create_leaves_without_offset(
    db: &Database2,
    set_json: &SetJson,
    prfs_set: &mut PrfsSet,
) -> Result<u64, TreeMakerError> {
    let set_id = set_json.set.set_id.to_string();

    let set_insert_interval = ENVS.set_insert_interval;

    println!(
        "{} leaves without offset, set_id: {}, set_insert_interval: {}",
        "Creating".green(),
        set_id,
        set_insert_interval,
    );

    let where_clause = format!("{}", set_json.set.where_clause,);

    let now = SystemTime::now();
    let accounts = db.get_eth_accounts(&where_clause).await?;
    let elapsed = now.elapsed().unwrap();

    println!(
        "Query took {} ms - get_eth_accounts, row_count: {}",
        elapsed.as_millis(),
        accounts.len(),
    );

    assert!(
        accounts.len() < 1,
        "no account to create as leaves, set_id: {}",
        set_id
    );

    let mut nodes = vec![];

    for (idx, account) in accounts.iter().enumerate() {
        let node = PrfsTreeNode {
            pos_w: Decimal::from_u64(idx as u64).unwrap(),
            pos_h: 0,
            val: account.addr.to_string(),
            set_id: set_id.to_string(),
        };

        nodes.push(node);
    }

    let updated_count = db.insert_prfs_tree_nodes(&nodes, false).await?;

    println!(
        "{} a set, set_id: {}, updated_count: {}, accounts len: {}",
        "Created".green(),
        set_id,
        updated_count,
        accounts.len(),
    );

    assert_eq!(
        updated_count,
        accounts.len() as u64,
        "updated count should be equal to accounts len, {} != {}",
        updated_count,
        accounts.len()
    );

    prfs_set.cardinality = updated_count as i64;
    db.insert_prfs_set(&prfs_set, true).await.unwrap();

    Ok(updated_count)
}
