use colored::Colorize;
use prfs_crypto::{
    convert_32bytes_into_decimal_string,
    crypto_bigint::{self, Encoding, U256},
    hex, poseidon_2, ZERO_NODE,
};
use prfs_entities::entities::{PrfsSetElement, PrfsSetElementDataType, PrfsTreeNode};
use rust_decimal::{prelude::FromPrimitive, Decimal};
use std::u128;

use crate::TreeMakerError;

pub fn create_leaves(
    set_elements: Vec<PrfsSetElement>,
) -> Result<Vec<PrfsTreeNode>, TreeMakerError> {
    let mut nodes = vec![];
    for (elem_idx, elem) in set_elements.iter().enumerate() {
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
                PrfsSetElementDataType::Int => {
                    let int128 = d.val.parse::<u128>().unwrap();
                    let u = U256::from_u128(int128);
                    let bytes = u.to_be_bytes();
                    args[idx] = bytes;
                }
            };
        }

        // println!("data: {:?}", data);
        // println!("args: {:?}", args);
        let val = poseidon_2(&args[0], &args[1]).unwrap();
        let val = format!("0x{}", hex::encode(val));
        // let val = U256::from_be_bytes(val);
        println!("val: {:?}", val);

        let node = PrfsTreeNode {
            pos_w: Decimal::from_u64(elem_idx as u64).unwrap(),
            pos_h: 0,
            meta: None,
            val,
            set_id: elem.set_id.to_string(),
        };

        nodes.push(node);
    }

    return Ok(nodes);
}
