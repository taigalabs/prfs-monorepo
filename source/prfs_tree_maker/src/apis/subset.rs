use crate::{geth::GethClient, paths::Paths, TreeMakerError};
use prfs_db_interface::{
    database::Database,
    models::{AccountNode, Node},
};
use rust_decimal::{prelude::FromPrimitive, Decimal};
use serde::{Deserialize, Serialize};

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
    let subset_query_limit = std::env::var("SUBSET_QUERY_LIMIT")?;

    let subset_json = read_subset_file(paths, subset_filename)?;

    create_subset(&db, subset_json, subset_query_limit).await?;

    Ok(())
}

fn read_subset_file(paths: &Paths, subset_filename: String) -> Result<SubsetJson, TreeMakerError> {
    println!("subset_filename: {}", subset_filename);

    let subset_json_path = paths.subsets.join(subset_filename);

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
    subset_json: SubsetJson,
    subset_query_limit: String,
) -> Result<(), TreeMakerError> {
    let set_id = subset_json.set_id;

    let mut should_loop = true;
    let mut count = 0;

    while should_loop {
        let where_clause = format!(
            "{} offset {} limit {}",
            subset_json.where_clause, count, subset_query_limit
        );
        let accounts = db.get_accounts(&where_clause).await?;

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

        // let nodes: Vec<Node> = accounts
        //     .iter()
        //     .enumerate()
        //     .map(|(idx, acc)| Node {
        //         pos_w: Decimal::from_u64((count + idx) as u64).unwrap(),
        //         pos_h: 0,
        //         val: acc.addr.to_string(),
        //         set_id: set_id.to_string(),
        //     })
        //     .collect();

        db.insert_nodes(nodes, true).await?;
        db.insert_account_nodes(account_nodes, true).await?;

        println!("current count: {}", count);
        // println!("accs len: {:?}", accounts);

        count += accounts.len();

        if accounts.len() < 1 {
            should_loop = false;
        }
    }

    println!(
        "Finish creating a subset, set_id: {}, total count: {}",
        set_id, count
    );

    Ok(())
}
