use super::json::SetJson;
use crate::TreeMakerError;
use prfs_db_interface::{database::Database, models::PrfsTreeNode};
use rust_decimal::{prelude::FromPrimitive, Decimal};
use std::time::{Duration, SystemTime};

pub async fn create_leaf(
    db: &Database,
    set_json: &SetJson,
    set_id: i64,
) -> Result<(), TreeMakerError> {
    let set_query_limit = std::env::var("SET_QUERY_LIMIT").unwrap();

    let set_offset = {
        let s = std::env::var("SET_OFFSET").unwrap();
        s.parse::<usize>().unwrap()
    };

    let set_insert_interval = {
        let s: u64 = std::env::var("SET_INSERT_INTERVAL")
            .unwrap()
            .parse()
            .unwrap();
        s
    };

    println!(
        "set_offset: {}, set_query_limit: {}, set_insert_interval: {}",
        set_offset, set_query_limit, set_insert_interval,
    );

    let break_every = {
        let b = set_query_limit.parse::<usize>().unwrap();
        b * 2
    };

    let mut offset = set_offset;
    let mut count = 0;

    loop {
        let where_clause = format!(
            "{} offset {} limit {}",
            set_json.set.where_clause, offset, set_query_limit,
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
                id: None,
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
            tokio::time::sleep(Duration::from_millis(set_insert_interval)).await;
        }

        if accounts.len() < 1 {
            break;
        }
    }

    println!(
        "Finish creating a set, set_id: {}, total count: {}",
        set_id, count,
    );

    Ok(())
}
