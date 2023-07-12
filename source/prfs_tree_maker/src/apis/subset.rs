use crate::{geth::GethClient, paths::Paths, TreeMakerError};
use prfs_db_interface::{
    database::Database,
    models::{AccountNode, Node},
};
use rust_decimal::{prelude::FromPrimitive, Decimal};
use serde::{Deserialize, Serialize};
use std::{
    io::Write,
    time::{Duration, SystemTime},
};

#[derive(Serialize, Deserialize, Debug)]
pub struct SubsetJson {
    set_id: String,
    where_clause: String,
}

pub async fn run(paths: &Paths) -> Result<(), TreeMakerError> {
    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT")?;
    let pg_pw = std::env::var("POSTGRES_PW")?;
    let db = Database::connect(pg_endpoint, pg_pw).await?;

    let subset_filename = std::env::var("SUBSET_FILENAME")?;

    let subset_json = read_subset_file(paths, subset_filename)?;

    create_subset(&db, paths, subset_json).await?;

    Ok(())
}

fn read_subset_file(paths: &Paths, subset_filename: String) -> Result<SubsetJson, TreeMakerError> {
    println!("subset_filename: {}", subset_filename);

    let subset_json_path = paths.data.join(subset_filename);

    let subset_json_bytes = std::fs::read(&subset_json_path).expect(&format!(
        "Subset should exist, path: {:?}",
        subset_json_path,
    ));

    let subset_json: SubsetJson = serde_json::from_slice(&subset_json_bytes).unwrap();

    println!("subset_json: {:?}", subset_json);

    Ok(subset_json)
}

async fn create_subset(
    db: &Database,
    paths: &Paths,
    subset_json: SubsetJson,
) -> Result<(), TreeMakerError> {
    let subset_query_limit = std::env::var("SUBSET_QUERY_LIMIT")?;

    let subset_offset = {
        let s = std::env::var("SUBSET_OFFSET")?;
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

    let set_id = subset_json.set_id;

    let mut should_loop = true;
    let mut offset = subset_offset;
    let mut count = 0;

    loop {
        let where_clause = format!(
            "{} offset {} limit {}",
            subset_json.where_clause, offset, subset_query_limit
        );

        let now = SystemTime::now();
        let accounts = db.get_accounts(&where_clause).await?;

        let elapsed = now.elapsed().unwrap();
        println!("query took {} ms", elapsed.as_millis());

        let mut nodes = vec![];
        let mut account_nodes = vec![];

        for (idx, account) in accounts.iter().enumerate() {
            let node = Node {
                pos_w: Decimal::from_u64((count + idx) as u64).unwrap(),
                pos_h: 0,
                val: account.addr.to_string(),
                set_id: set_id.to_string(),
            };

            let account_node = AccountNode {
                addr: account.addr.to_string(),
                set_id: set_id.to_string(),
            };

            nodes.push(node);
            account_nodes.push(account_node);
        }

        if nodes.len() == 0 {
            break;
        }

        if nodes.len() != account_nodes.len() {
            panic!(
                "nodes {} and account_node {} counts are different",
                nodes.len(),
                account_nodes.len()
            );
        }

        let nodes_updated = db.insert_nodes(&nodes, false).await?;
        let account_node_updated = db.insert_account_nodes(&account_nodes, false).await?;

        if nodes_updated != account_node_updated {
            panic!(
                "nodes {} and account_node {} update counts are different, count: {}, offset: {}",
                nodes_updated, account_node_updated, count, offset,
            );
        }

        count += accounts.len();
        offset += accounts.len();

        println!(
            "Inserted, nodes updated: {}, account_node updated: {}, current count: {}",
            nodes_updated, account_node_updated, count,
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
