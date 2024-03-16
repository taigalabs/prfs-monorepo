use prfs_crypto::{
    convert_32bytes_le_into_decimal_string, convert_dec_into_32bytes, convert_hex_into_32bytes,
    crypto_bigint::Encoding, hex, poseidon::poseidon_2, primitive_types, ZERO_NODE,
};
use prfs_entities::entities::{PrfsSet, PrfsSetElement, PrfsSetElementDataType};

use crate::TreeMakerError;

pub fn create_leaves(set_elements: &Vec<PrfsSetElement>) -> Result<Vec<[u8; 32]>, TreeMakerError> {
    let mut nodes = vec![];
    for (idx, elem) in set_elements.iter().enumerate() {
        let data = &elem.data;
        let mut args = [ZERO_NODE, ZERO_NODE];

        if data.len() > 2 {
            return Err("data of length over two is currently not available".into());
        }

        for (idx, d) in data.iter().enumerate() {
            match d.r#type {
                PrfsSetElementDataType::WalletCm => {
                    let val = if d.val.starts_with("0x") {
                        &d.val[2..]
                    } else {
                        &d.val
                    };

                    // let leaf_decimal = primitive_types::U256::from_str_radix(&val, 16)?;
                    // println!("leaf decimal {}", leaf_decimal);

                    let bytes = convert_hex_into_32bytes(&val).unwrap();
                    // println!("cm: {:?}, bytes: {:?}", val, bytes);
                    args[idx] = bytes;
                }
                PrfsSetElementDataType::Int => {
                    // let int128 = d.val.parse::<u128>().unwrap();
                    // let u = U256::from_u128(int128);
                    // let bytes = u.to_be_bytes();
                    let bytes = convert_dec_into_32bytes(&d.val).unwrap();
                    args[idx] = bytes;
                }
            };
        }

        // println!("args: {:?}, elem: {:?}", args, elem);
        let val = poseidon_2(&args[0], &args[1]).unwrap();
        // let int = convert_32bytes_le_into_decimal_string(&val).unwrap();
        // let val2 = U256::from_be_bytes(val);
        // println!(
        //     "idx: {}, poseidon: {:?}, int: {}, args: {:?}",
        //     idx, val, int, args
        // );

        nodes.push(val);
    }

    return Ok(nodes);
}

pub fn calc_parent_nodes(children: &Vec<[u8; 32]>) -> Result<Vec<[u8; 32]>, TreeMakerError> {
    if children.len() < 1 {
        return Err(format!("Cannot climb if there is no children ").into());
    }

    let parents = match prfs_crypto::calc_parent_nodes(&children) {
        Ok(p) => p,
        Err(err) => return Err(format!("calc parent err: {}", err).into()),
    };

    return Ok(parents);
}
