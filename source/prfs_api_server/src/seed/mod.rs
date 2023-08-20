mod data;

use self::data::get_prfs_proof_types;

pub async fn upload() {
    let proof_types = get_prfs_proof_types();

    println!("proof_types: {:?}", proof_types);
}
