use super::json::SetJson;
use crate::{envs::ENVS, TreeMakerError};
use colored::Colorize;
use prfs_db_interface::{database2::Database2, db_apis};
use prfs_entities::entities::{PrfsSet, PrfsTreeNode};
use prfs_entities::sqlx::{Pool, Postgres, Transaction};
use rust_decimal::{prelude::FromPrimitive, Decimal};

pub async fn create_leaves_without_offset(
    pool: &Pool<Postgres>,
    tx: &mut Transaction<'_, Postgres>,
    set_json: &SetJson,
    prfs_set: &mut PrfsSet,
) -> Result<Vec<PrfsTreeNode>, TreeMakerError> {
    let set_id = set_json.set.set_id;
    let set_insert_interval = ENVS.set_insert_interval;
    let where_clause = format!("{}", set_json.set.where_clause,);

    let now1 = chrono::Local::now();

    println!(
        "{} eth accounts, set_id: {}, set_insert_interval: {}, start_time: {}",
        "Retrieving".green(),
        set_id,
        set_insert_interval,
        now1,
    );

    let accounts = db_apis::get_eth_accounts(pool, &where_clause).await?;
    let now2 = chrono::Local::now();
    let elapsed = now2 - now1;

    println!(
        "Query took {} s - get_eth_accounts, row_count: {}",
        elapsed.to_string(),
        accounts.len(),
    );

    assert!(
        accounts.len() > 1,
        "no account to create as leaves, set_id: {}",
        set_id
    );

    let mut nodes = vec![];

    for (idx, account) in accounts.iter().enumerate() {
        let node = PrfsTreeNode {
            pos_w: Decimal::from_u64(idx as u64).unwrap(),
            pos_h: 0,
            meta: None,
            val: account.addr.to_string(),
            set_id,
        };

        nodes.push(node);
    }

    let node_chunks: Vec<_> = nodes.chunks(2000).collect();

    println!(
        "{} leaf nodes, count: {}, chunk len: {}",
        "Inserting".green(),
        nodes.len(),
        node_chunks.len()
    );

    let mut total_count = 0;

    for chunk in node_chunks {
        let updated_count = db_apis::insert_prfs_tree_nodes(tx, chunk, false).await?;
        total_count += updated_count;

        println!(
            "{} leaf nodes, set_id: {}, updated_count: {}, total_count: {}",
            "Inserted".green(),
            set_id,
            updated_count,
            total_count,
        );
    }

    // let updated_count = db_apis::insert_prfs_tree_nodes(tx, &nodes, false).await?;

    assert_eq!(
        total_count,
        accounts.len() as u64,
        "updated count should be equal to accounts len, {} != {}",
        total_count,
        accounts.len()
    );

    prfs_set.cardinality = total_count as i64;
    db_apis::insert_prfs_set(tx, &prfs_set, true).await.unwrap();

    Ok(nodes)
}
