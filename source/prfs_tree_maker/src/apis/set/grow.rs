use super::SetType;
use crate::{apis::set::grow, constants::TREE_DEPTH, TreeMakerError};
use ff::PrimeField;
// use halo2_gadgets::{
//     poseidon::{
//         self,
//         primitives::{ConstantLength, P128Pow5T3, Spec},
//         Hash,
//     },
//     utilities::UtilitiesInstructions,
// };
// use halo2_proofs::halo2curves::{pasta::Fp as PastaFp, serde::SerdeObject};
use prfs_db_interface::{Database, Node};
use rust_decimal::{prelude::ToPrimitive, Decimal};

pub async fn grow_tree(db: &Database, set_type: &SetType) -> Result<(), TreeMakerError> {
    println!("grow tree()");

    let where_clause = format!(
        "set_id = '{}' AND pos_h = {} ORDER BY pos_w",
        set_type.set_id, 0,
    );
    let rows = db.get_nodes(&where_clause).await?;

    let leaf_nodes: Result<Vec<Node>, TreeMakerError> = rows
        .iter()
        .enumerate()
        .map(|(idx, r)| {
            let pos_w: Decimal = r.try_get("pos_w").unwrap();

            let idx = Decimal::from(idx);
            if idx != pos_w {
                return Err(format!(
                    "idx does not match pos_w, pos_w: {}, set_id: {}",
                    pos_w, set_type.set_id
                )
                .into());
            }

            let pos_h: i32 = r.try_get("pos_h").unwrap();
            let val: String = r.try_get("val").unwrap();
            let set_id: String = r.try_get("set_id").unwrap();

            Ok(Node {
                pos_w,
                pos_h,
                val,
                set_id,
            })
        })
        .collect();

    let leaf_nodes = leaf_nodes?;

    // let nodes = populate_tree(leaf_nodes, set_type)?;

    // for h in 1..nodes.len() {
    //     let nodes_at_h = &nodes[h];
    //     for (w, node) in nodes_at_h.iter().enumerate() {
    //         println!("h: {}, w: {}, val: {}", h, w, node.val);
    //     }
    // }

    // let nodes_flattened: Vec<Node> = nodes.into_iter().flatten().collect();

    // let rows_affected = db
    //     .insert_nodes(set_type.set_id.to_string(), nodes_flattened, true)
    //     .await?;

    // println!("grow(): rows affected: {}", rows_affected);

    Ok(())
}

// fn populate_tree(
//     leaf_nodes: Vec<Node>,
//     set_type: &SetType,
// ) -> Result<Vec<Vec<Node>>, TreeMakerError> {
//     let mut nodes: Vec<Vec<Node>> = vec![];

//     nodes.push(leaf_nodes);

//     for h in 1..TREE_DEPTH {
//         let curr_nodes = &nodes[h as usize - 1];
//         // println!("h: {}, curr_nodes: {:?}", h, curr_nodes);

//         let mut next_nodes = vec![];
//         for idx in (0..curr_nodes.len()).step_by(2) {
//             // println!("h: {}, idx: {}", h, idx);

//             let left = match curr_nodes.get(idx as usize) {
//                 Some(n) => {
//                     let mut node_vec = hex::decode(&n.val[2..]).unwrap();
//                     node_vec.reverse();

//                     let node_arr: [u8; 32] = node_vec.try_into().unwrap();
//                     PastaFp::from_repr(node_arr).unwrap()
//                 }
//                 None => {
//                     return Err("Left node should always exist".into());
//                 }
//             };

//             let right = match curr_nodes.get(idx as usize + 1) {
//                 Some(n) => {
//                     let mut node_vec = hex::decode(&n.val[2..]).unwrap();
//                     node_vec.reverse();

//                     let node_arr: [u8; 32] = node_vec.try_into().unwrap();
//                     PastaFp::from_repr(node_arr).unwrap()
//                 }
//                 None => PastaFp::zero(),
//             };

//             let msg = [left, right];
//             let parent_val =
//                 poseidon::primitives::Hash::<PastaFp, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
//                     .hash(msg);
//             let mut parent_arr = parent_val.to_repr();
//             parent_arr.reverse();

//             let parent_hex = format!("0x{}", hex::encode(parent_arr));
//             let h: i32 = h.try_into().unwrap();

//             let parent_node = Node {
//                 pos_w: Decimal::from(idx / 2),
//                 pos_h: h,
//                 val: parent_hex,
//                 set_id: set_type.set_id.to_string(),
//             };

//             // println!("h: {}, idx: {}, parent node: {:?}", h, idx, parent_node);
//             next_nodes.push(parent_node);
//         }

//         nodes.push(next_nodes);
//     }

//     return Ok(nodes);
// }

#[test]
pub fn test_grow_1() {
    println!("test_grow_1()");

    let set_type = SetType {
        set_id: "1".to_string(),
        table_label: "".to_string(),
        query: "".to_string(),
    };

    let leaf_nodes: Result<Vec<Node>, TreeMakerError> = [
        "0x00000000000000000000000033d10ab178924ecb7ad52f4c0c8062c3066607ec",
        "0x000000000000000000000000f3e28453c74609cd275de994bc5bbae3ccbcfa56",
        "0x0000000000000000000000008be09401bfc531f5442e81cc13ead61b83ee20f8",
        "0x000000000000000000000000402b7d5aa4ecc29c55baae44493d0f1e74eaea2c",
        "0x000000000000000000000000ed45c44e9a6ee4bc86c1b58c3e777528edb74e3b",
        "0x000000000000000000000000b0768fd406350becf576f8b8ec06e51a4dfb22ef",
        "0x0000000000000000000000004b6c8ce2f1c4f0b0b3a7eca2843991b6c2d6b313",
        "0x00000000000000000000000030532d90d19d2b01dfeb9bb5e9a0f9608ecde1c6",
        "0x000000000000000000000000e8651db4ecfc78cffc43e2baa69f64f67cd894f3",
        "0x000000000000000000000000267e3b6b33665f21962ed4077962826b618e7377",
        "0x000000000000000000000000a480bb750ba4c90d45a64918fbe48fd73d816d7c",
        "0x00000000000000000000000059b0d76d95e037587bfa7eb8f06969968028d753",
        "0x000000000000000000000000f2dcb1e6aefa3c2e3bee92d153d53fafe7c8392f",
        "0x0000000000000000000000001e8256c1709cecd969708bb22b7318e55636e5b0",
        "0x00000000000000000000000043989edc84067a5738c9fc0096e31262aa7b2c4f",
        "0x000000000000000000000000d3ac7cf14f3ec2729ff6d8eba6b9b59533ca29f7",
        "0x000000000000000000000000c7846db42a04093df40c64eded2360454ac2e75b",
        "0x000000000000000000000000ae7dc1be1bad41326a31bc92debc7b528e834efa",
        "0x0000000000000000000000007649c1f1d7117547d3162386a3d730f926689961",
        "0x000000000000000000000000207d8d3f74da805f5fba61dedd3ff0de09c49f4e",
        "0x000000000000000000000000c51f4126ccf4e83b199589b6f15989f285f47221",
        "0x0000000000000000000000006d9937705db03597ddae5ee1936e1e30b0f5c438",
        "0x000000000000000000000000d5e634d714e2f6795f43d367b5d78a550241b472",
        "0x000000000000000000000000133f40bbef1ac0c66683cb06ba88bff57e3b50a7",
        "0x000000000000000000000000aa846f4f64e60cefc02ee3b735ea957c590ce114",
        "0x0000000000000000000000009d1a13ec01f5b645b4617092016609f7431c22c9",
        "0x000000000000000000000000834ab3cbbf57f81a835fe43df06ff83503bebe87",
        "0x000000000000000000000000969b962abbb46cd2cf5b426de3dcaf25d9ab58eb",
        "0x00000000000000000000000006347e297f223ce76022fcba3959ad43f9cd3050",
        "0x00000000000000000000000063c3b6aa59f18e0554a93903680a5869818065dc",
        "0x0000000000000000000000005d198f19860e20c94db0674c9d4ba2ea3bb31f70",
        "0x00000000000000000000000097500419ac2d6c3fa70f0f4b86235e2559208e4b",
        "0x000000000000000000000000e55c91e0e585fa9339a363a6c94403f5295b6434",
        "0x00000000000000000000000085e82a4568d8565eff1159ce53c8a1da990b9523",
        "0x000000000000000000000000c8bb018fa4de396565482eca52df72bdc5227ced",
        "0x0000000000000000000000006e0623012129282514aabc7030fcd40cdccdd0b7",
        "0x000000000000000000000000f8826c92b709bbb9739bc07523152a9dc9ac61d6",
        "0x000000000000000000000000791e7de2a858a789b4c5ef4b659cc4192c03f968",
        "0x000000000000000000000000d16639f413a16edd7067cf6d253c788a18a18804",
        "0x00000000000000000000000031abe0a54ed6bea12fd21961051e40d049dcbb67",
        "0x000000000000000000000000eb2a9f97dc01ed5574bd6cb9a1121d5bd8a596ed",
        "0x000000000000000000000000e8abdc7454cb38b3b951cc2bc1815d481b5b7300",
        "0x0000000000000000000000008cff411ab75fb45c29dea29643b1c5f95aecd1df",
        "0x00000000000000000000000050f8c08b0124092e1001b355f4b8ae2df85f715c",
        "0x000000000000000000000000f4b9c8d5c37374b0eafbcb0b09abb717612f372f",
    ]
    .iter()
    .enumerate()
    .map(|(idx, addr)| {
        let pos_w = Decimal::from(idx);
        let pos_h = 0;
        let val = addr.to_string();
        let set_id: String = "1".to_string();

        Ok(Node {
            pos_w,
            pos_h,
            val,
            set_id,
        })
    })
    .collect();

    let leaf_nodes = leaf_nodes.unwrap();

    // populate_tree(leaf_nodes, &set_type).unwrap();
}
