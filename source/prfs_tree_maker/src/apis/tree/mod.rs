use colored::Colorize;
use prfs_crypto::{
    crypto_bigint::{self, Encoding, U256},
    poseidon_2, ZERO_NODE,
};
use prfs_entities::entities::{PrfsSetElement, PrfsSetElementDataType, PrfsTreeNode};
use rust_decimal::{prelude::FromPrimitive, Decimal};

use crate::TreeMakerError;

pub fn create_leaves(set_elements: Vec<PrfsSetElement>) -> Result<(), TreeMakerError> {
    // let set_id = set_json.set.set_id;
    // let set_insert_interval = ENVS.set_insert_interval;
    // let where_clause = format!("{}", set_json.set.where_clause,);

    let now1 = chrono::Local::now();

    // let mut nodes = vec![];
    for (idx, elem) in set_elements.iter().enumerate() {
        let data = &elem.data;
        let mut args = [ZERO_NODE, ZERO_NODE];

        if data.len() > 2 {
            return Err("data of length over two is currently not available".into());
        }

        for (idx, d) in data.iter().enumerate() {
            match d.r#type {
                PrfsSetElementDataType::Hex32 => {
                    let u = U256::from_be_hex(&d.val);
                    let bytes = u.to_be_bytes();
                    args[idx] = bytes;
                }
                PrfsSetElementDataType::Int => (),
            };
        }

        println!("data: {:?}", data);
        println!("args: {:?}", args);
        let p = poseidon_2(&args[0], &args[1]).unwrap();
        println!("p: {:?}", p);

        // let node = PrfsTreeNode {
        //     pos_w: Decimal::from_u64(idx as u64).unwrap(),
        //     pos_h: 0,
        //     meta: None,
        //     val: account.addr.to_string(),
        //     set_id: elem.set_id.to_string(),
        // };

        // nodes.push(node);
    }

    // let node_chunks: Vec<_> = nodes.chunks(2000).collect();

    // println!(
    //     "{} leaf nodes, count: {}, chunk len: {}",
    //     "Inserting".green(),
    //     nodes.len(),
    //     node_chunks.len()
    // );

    // let mut total_count = 0;

    // for chunk in node_chunks {
    //     let updated_count = prfs::insert_prfs_tree_nodes(tx, chunk, false).await?;
    //     total_count += updated_count;

    //     println!(
    //         "{} leaf nodes, set_id: {}, updated_count: {}, total_count: {}",
    //         "Inserted".green(),
    //         set_id,
    //         updated_count,
    //         total_count,
    //     );
    // }

    // let updated_count = db_apis::insert_prfs_tree_nodes(tx, &nodes, false).await?;

    // assert_eq!(
    //     total_count,
    //     accounts.len() as u64,
    //     "updated count should be equal to accounts len, {} != {}",
    //     total_count,
    //     accounts.len()
    // );

    // prfs_set.cardinality = total_count as i64;
    // prfs::upsert_prfs_set(tx, &prfs_set).await.unwrap();

    let now2 = chrono::Local::now();
    let elapsed = now2 - now1;

    return Ok(());
}
