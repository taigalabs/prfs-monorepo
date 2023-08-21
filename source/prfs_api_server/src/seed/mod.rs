mod data;

use self::data::get_prfs_proof_types;

pub async fn upload() {
    let proof_types = get_prfs_proof_types();

    let a = uuid::Uuid::from_u128(0);
    println!("a: {}", a);

    println!("proof_types: {:?}", proof_types);
}
