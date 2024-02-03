use crate::{
    convert_32bytes_le_into_decimal_string, convert_dec_into_32bytes, convert_hex_into_32bytes,
    hash_two, MerkleProof,
};

pub fn verify(merkle_proof: MerkleProof, leaf: [u8; 32]) {
    println!("verify(), leaf: {:?}", leaf);

    let mut curr = leaf;

    for (idx, p) in merkle_proof.path_indices.iter().enumerate() {
        if *p == 0 {
            let sibling = &merkle_proof.siblings[idx];
            let sib = convert_dec_into_32bytes(&sibling).unwrap();
            let res = hash_two(&curr, &sib).unwrap();
            curr = res.clone();
        } else if *p == 1 {
            let sibling = &merkle_proof.siblings[idx];
            let sib = convert_dec_into_32bytes(&sibling).unwrap();
            let res = hash_two(&sib, &curr).unwrap();
            curr = res.clone();
        } else {
            panic!("path not valid");
        }
    }

    let st = convert_32bytes_le_into_decimal_string(&curr).unwrap();

    assert_eq!(
        st, merkle_proof.root,
        "root (calculated): {}, root (merkle proof): {}",
        st, merkle_proof.root,
    );
}
