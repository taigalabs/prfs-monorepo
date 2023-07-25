use super::json::SetJson;
use crate::TreeMakerError;
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

    let set_insert_interval = {
        let s: u64 = std::env::var("SET_INSERT_INTERVAL")
            .unwrap()
            .parse()
            .unwrap();
        s
    };

    println!(
        "{} creating leaves without offset, set_id: {}, set_insert_interval: {}",
        "Start".green(),
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
        "Inserted, nodes updated: {}, current count: {}",
        nodes_updated, count,
    );

    println!(
        "Finish creating a set, set_id: {}, total count: {}",
        set_id, count,
    );

    prfs_set.cardinality = Decimal::from(count);

    db.insert_prfs_set(&prfs_set, true).await.unwrap();

    Ok(())
}

// pub async fn create_leaves(db: &Database, set_json: &SetJson) -> Result<(), TreeMakerError> {
//     let set_query_limit = std::env::var("SET_QUERY_LIMIT").unwrap();

//     let set_offset = {
//         let s = std::env::var("SET_OFFSET").unwrap();
//         s.parse::<usize>().unwrap()
//     };

//     let set_insert_interval = {
//         let s: u64 = std::env::var("SET_INSERT_INTERVAL")
//             .unwrap()
//             .parse()
//             .unwrap();
//         s
//     };

//     let set_id = set_json.set.set_id.to_string();

//     println!(
//         "{} creating leaves, set_offset: {}, set_query_limit: {}, set_insert_interval: {}\
//             set_id: {}",
//         "Start".green(),
//         set_offset,
//         set_query_limit,
//         set_insert_interval,
//         set_id,
//     );

//     let break_every = {
//         let l = set_query_limit.parse::<usize>().unwrap();
//         l * 2
//     };

//     let mut offset = set_offset;
//     let mut count = 0;

//     loop {
//         let where_clause = format!(
//             "{} offset {} limit {}",
//             set_json.set.where_clause, offset, set_query_limit,
//         );

//         let now = SystemTime::now();
//         let accounts = db.get_eth_accounts(&where_clause).await?;
//         let elapsed = now.elapsed().unwrap();

//         println!(
//             "Query took {} ms - get_accounts, row_count: {}",
//             elapsed.as_millis(),
//             accounts.len(),
//         );

//         let mut nodes = vec![];

//         for (idx, account) in accounts.iter().enumerate() {
//             let node = PrfsTreeNode {
//                 pos_w: Decimal::from_u64((count + idx) as u64).unwrap(),
//                 pos_h: 0,
//                 val: account.addr.to_string(),
//                 set_id: set_id.to_string(),
//             };

//             nodes.push(node);
//         }

//         if nodes.len() == 0 {
//             break;
//         }

//         let nodes_updated = db.insert_prfs_tree_nodes(&nodes, false).await?;

//         count += accounts.len();
//         offset += accounts.len();

//         println!(
//             "Inserted, nodes updated: {}, current count: {}",
//             nodes_updated, count,
//         );

//         if count % break_every == 0 {
//             println!("sleep");
//             tokio::time::sleep(Duration::from_millis(set_insert_interval)).await;
//         }

//         if accounts.len() < 1 {
//             break;
//         }
//     }

//     println!(
//         "Finish creating a set, set_id: {}, total count: {}",
//         set_id, count,
//     );

//     Ok(())
// }
