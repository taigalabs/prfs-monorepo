use super::json::{self, SubsetJson};
use crate::{paths::PATHS, TreeMakerError};
use prfs_db_interface::{database::Database, models::PrfsTreeNode};
use rust_decimal::{prelude::FromPrimitive, Decimal};
use std::time::{Duration, SystemTime};

pub async fn create_leaf(db: &Database, subset_json: &SubsetJson) -> Result<(), TreeMakerError> {
    let subset_query_limit = std::env::var("SUBSET_QUERY_LIMIT").unwrap();

    let subset_offset = {
        let s = std::env::var("SUBSET_OFFSET").unwrap();
        s.parse::<usize>().unwrap()
    };

    let subset_insert_interval = {
        let s: u64 = std::env::var("SUBSET_INSERT_INTERVAL")
            .expect("env var SCAN_INTERVAL missing")
            .parse()
            .unwrap();
        s
    };

    println!(
        "subset_offset: {}, subset_query_limit: {}, subset_insert_interval: {}",
        subset_offset, subset_query_limit, subset_insert_interval
    );

    let break_every = {
        let b = subset_query_limit.parse::<usize>().unwrap();
        b * 2
    };

    let set_id = &subset_json.subset.set_id;
    let mut offset = subset_offset;
    let mut count = 0;

    loop {
        let where_clause = format!(
            "{} offset {} limit {}",
            subset_json.subset.where_clause, offset, subset_query_limit
        );

        let now = SystemTime::now();
        let accounts = db.get_accounts(&where_clause).await?;

        let elapsed = now.elapsed().unwrap();
        println!("Query took {} ms - get_accounts", elapsed.as_millis());

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

        if nodes.len() == 0 {
            break;
        }

        let nodes_updated = db.insert_eth_tree_nodes(&nodes, false).await?;

        count += accounts.len();
        offset += accounts.len();

        println!(
            "Inserted, nodes updated: {}, current count: {}",
            nodes_updated, count,
        );

        if count % break_every == 0 {
            println!("sleep");
            tokio::time::sleep(Duration::from_millis(subset_insert_interval)).await;
        }

        if accounts.len() < 1 {
            break;
        }
    }

    println!(
        "Finish creating a subset, set_id: {}, total count: {}",
        set_id, count
    );

    Ok(())
}
