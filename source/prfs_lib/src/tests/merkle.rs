use crate::{
    tests::{poseidon::PoseidonHash, utils::hex_to_str},
    PrfsLibError,
};
use poseidon::poseidon_k256::hash_from_bytes;
use primitive_types::U256;
use rs_merkle::{Hasher, MerkleProof, MerkleTree};
use sha2::{digest::FixedOutput, Digest, Sha256};

#[test]
fn test_11() -> Result<(), PrfsLibError> {
    println!("aaa");
    Ok(())
}

#[test]
fn test_merkle_tree() -> Result<(), PrfsLibError> {
    println!("test_merkle_tree()");

    let inputs = [0u8; 64];
    let res = hash_from_bytes(&inputs).unwrap();
    println!("res: {:?}", res);

    let mut res2 = res.clone();
    res2.reverse();

    let a = hex::encode(res2);
    println!("a: {}", a);

    let b = U256::from_str_radix(&a, 16).unwrap();
    println!("b: {}", b);

    let prover_addr = "0x33d10ab178924ecb7ad52f4c0c8062c3066607ec";
    let prover_addr = prover_addr.trim_start_matches("0x");

    // normalize
    // const inputsBytes = new Uint8Array(32 * inputs.length);
    // for (let i = 0; i < inputs.length; i++) {
    //   inputsBytes.set(bigIntToLeBytes(inputs[i], 32), i * 32);
    // }

    let addrs = [
        "0x33d10ab178924ecb7ad52f4c0c8062c3066607ec",
        "0x4f6fcaae3fc4124acaccc780c6cb0dd69ddbeff8",
        "0x50d34ee0ac40da7779c42d3d94c2072e5625395f",
        "0x51c0e162bd86b63933262d558a8953def4e30c85",
        // "0x5247cdfffeeff5fac15e214c6bfcca5e45a135c0",
        // "0x53c8f1af4885182eae85779833548c8f5bc5d91a",
        //
        // "0x5683e37f839bf91cccfb1c8a677c770af5d2f690",
        // "0x5aee774c6e2533288b0a5547dc4f6be8d85907ab",
        // "0x5b140f8f4000fce4ac0baf88cb39dfdcf9c48cae",
        // "0x5d1762d202afbb376c2ffb99fba0bab6b08cdea6",
        // "0x604c8ff002b78cac70aff07adb7338e541d3a348",
        //
        // "0x62195385a55b3f2f77f13e355af8f5a2caf6ac78",
        // "0x6383e90818f26c4a01df881bd6ad6af416d50076",
        // "0x6420d34e50fa91e21f6864828709c392473f220a",
        // "0x6438ed942eea0f102950d06c74e73cf677f4655f",
        // "0x67284e6473dd2afca0782e24dae6d79f712c270f",
    ];

    let leaves: Vec<[u8; 32]> = addrs
        .iter()
        .map(|l| {
            let l = l.trim_start_matches("0x");
            let u = U256::from_str_radix(&l, 16).unwrap();
            println!("u: {}", u);

            let mut b = [0u8; 32];
            u.to_little_endian(&mut b);

            return PoseidonHash::hash(&b);
        })
        .collect();

    let merkle_tree = MerkleTree::<PoseidonHash>::from_leaves(&leaves);

    let root = merkle_tree.root().unwrap();
    println!("root bytes: {:?}", root);

    let root = U256::from_little_endian(&root);
    println!("root: {}", root);

    // println!(
    //     "merkle_tree root: {:?}, root hex: {:?}",
    //     merkle_tree.root(),
    //     merkle_tree.root_hex()
    // );

    return Ok(());

    let indices_to_prove = vec![3, 4];
    let leaves_to_prove = leaves.get(3..5).ok_or("can't get leaves to prove")?;
    let merkle_proof = merkle_tree.proof(&indices_to_prove);
    let merkle_root = merkle_tree.root().ok_or("couldn't get the merkle root")?;

    // Serialize proof to pass it to the client
    let proof_bytes = merkle_proof.to_bytes();

    // Parse proof back on the client
    let proof = MerkleProof::<PoseidonHash>::try_from(proof_bytes)?;
    // println!("proof: {}", proof);

    assert!(proof.verify(
        merkle_root,
        &indices_to_prove,
        leaves_to_prove,
        leaves.len()
    ));

    Ok(())
}

#[derive(Clone)]
pub struct Sha256Algorithm {}

impl Hasher for Sha256Algorithm {
    type Hash = [u8; 32];

    fn hash(data: &[u8]) -> [u8; 32] {
        let mut hasher = Sha256::new();

        hasher.update(data);
        <[u8; 32]>::from(hasher.finalize_fixed())
    }
}
