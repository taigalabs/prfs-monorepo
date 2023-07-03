use crate::{
    hexutils::{convert_fp_to_string, convert_string_into_fp},
    TreeMakerError,
};
use aws_config::meta::region::RegionProviderChain;
use aws_sdk_dynamodb::{client::fluent_builders, model::AttributeValue, Client as DynamoClient};
use ff::PrimeField;
use futures_util::pin_mut;
use futures_util::TryStreamExt;
use halo2_gadgets::{
    poseidon::{
        primitives::{self as poseidon, ConstantLength, P128Pow5T3 as OrchardNullifier, Spec},
        Hash,
    },
    utilities::UtilitiesInstructions,
};
use halo2_proofs::halo2curves::{pasta::Fp, serde::SerdeObject};
use std::{collections::HashMap, sync::Arc};
use tokio_postgres::{Client as PgClient, Error, GenericClient, NoTls};

pub async fn climb_up() -> Result<(), TreeMakerError> {
    let (pg_client, connection) = tokio_postgres::connect(
        "host=database-1.cstgyxdzqynn.ap-northeast-2.rds.amazonaws.com user=postgres password=postgres",
        NoTls,
    )
    .await?;

    let pg_client = Arc::new(pg_client);
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            println!("connection error: {}", e);
        }
    });

    let addr = "0x33d10Ab178924ECb7aD52f4c0C8062C3066607ec".to_lowercase();

    let addr = pg_client
        .query_one(
            "SELECT pos, table_id, val FROM nodes WHERE addr=$1",
            &[&addr],
        )
        .await
        .expect("addr should be found");

    let addr: &str = addr.get("val");

    let addr_val = convert_string_into_fp(addr);

    println!("STARTING addr: {}, addr_val (fp): {:?}", addr, addr_val);

    let auth_paths = generate_auth_paths(385);

    let mut curr = addr_val;

    for (height, path) in auth_paths.iter().enumerate() {
        println!("");
        let curr_idx = path.idx;
        let pos = &path.node_loc;

        let node = match pg_client
            .query_one("SELECT pos, table_id, val FROM nodes WHERE pos=$1", &[&pos])
            .await
        {
            Ok(row) => {
                let val: &str = row.get("val");
                let pos: &str = row.get("pos");

                println!("sibling node, pos: {}, val: {}", pos, val);

                let node = convert_string_into_fp(val);

                node
            }
            Err(err) => {
                println!("value doesn't exist, pos: {}", pos,);

                let node = Fp::zero();
                node
            }
        };

        if path.direction {
            let l = convert_fp_to_string(node);
            let r = convert_fp_to_string(curr);

            println!("l (fp): {:?}, r (fp): {:?}", node, curr);
            println!("l : {:?}, r : {:?}", l, r);

            let hash = poseidon::Hash::<_, OrchardNullifier, ConstantLength<2>, 3, 2>::init()
                .hash([node, curr]);

            curr = hash;
        } else {
            let l = convert_fp_to_string(curr);
            let r = convert_fp_to_string(node);

            // println!("l: {:?}, r: {:?}", l, r);
            println!("l (fp): {:?}, r (fp): {:?}", curr, node);
            println!("l: {:?}, r : {:?}", l, r);
            let hash = poseidon::Hash::<_, OrchardNullifier, ConstantLength<2>, 3, 2>::init()
                .hash([curr, node]);

            curr = hash;
        }

        let c = convert_fp_to_string(curr);

        println!(
            "curr (fp): {:?}, string: {}, parent_pos: {}",
            curr,
            c,
            format!("{}_{}", height + 1, curr_idx / 2)
        );
    }

    let c = convert_fp_to_string(curr);

    println!("finally curr: {:?}", curr,);
    println!("c: {:?}", c);

    Ok(())
}

#[derive(Debug, Clone)]
pub struct MerklePath {
    // Node idx at height
    pub idx: u128,

    // Relative position of sibling to curr node. e.g. 0_0 has 0_1 sibling with
    // direction "false"
    pub direction: bool,

    // Node location, e.g. 0_1 refers to the second node in the lowest height
    pub node_loc: String,
}

pub fn generate_auth_paths(idx: u128) -> Vec<MerklePath> {
    let height = 32;
    let mut auth_path = vec![];
    let mut curr_idx = idx;

    for h in 0..height {
        let sibling_idx = get_sibling_idx(curr_idx);

        let sibling_dir = if sibling_idx % 2 == 0 { true } else { false };

        let p = MerklePath {
            idx: sibling_idx,
            direction: sibling_dir,
            node_loc: format!("{}_{}", h, sibling_idx),
        };

        auth_path.push(p);

        let parent_idx = get_parent_idx(curr_idx);
        curr_idx = parent_idx;
    }

    auth_path
}

fn get_sibling_idx(idx: u128) -> u128 {
    if idx % 2 == 0 {
        idx + 1
    } else {
        idx - 1
    }
}

pub fn get_parent_idx(idx: u128) -> u128 {
    idx / 2
}
