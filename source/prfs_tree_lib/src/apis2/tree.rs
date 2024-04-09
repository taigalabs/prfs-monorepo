use prfs_crypto::{
    convert_dec_into_32bytes, convert_hex_into_32bytes, poseidon::poseidon_2, ZERO_NODE,
};
use prfs_entities::entities::PrfsSetElement;

use crate::TreeMakerError;

pub fn create_leaves(set_elements: &Vec<PrfsSetElement>) -> Result<Vec<[u8; 32]>, TreeMakerError> {
    let mut nodes = vec![];
    for (_idx, elem) in set_elements.iter().enumerate() {
        let data = &elem.data;
        let mut args = [ZERO_NODE, ZERO_NODE];

        {
            let val = if data.commitment.starts_with("0x") {
                &data.commitment[2..]
            } else {
                &data.commitment
            };
            let bytes = convert_hex_into_32bytes(&val)
                .map_err(|err| format!("Failed to convert cm, cm: {:?}, err: {}", val, err))?;
            // println!("cm: {:?}, bytes: {:?}", val, bytes);
            args[0] = bytes;
        }

        {
            let bytes = convert_dec_into_32bytes(&data.value_int.to_string()).map_err(|err| {
                format!(
                    "Failed to convert int, val: {}, err: {}",
                    &data.value_int, err
                )
            })?;
            args[1] = bytes;
        }

        // println!(
        //     "args:{:?}, comm: {}, value_int: {}",
        //     args, data.commitment, data.value_int
        // );

        let val = poseidon_2(&args[0], &args[1]).map_err(|err| {
            format!(
                "Failed to run poseidon to compute leaf, args: {:?}, err: {}",
                args, err
            )
        })?;

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
