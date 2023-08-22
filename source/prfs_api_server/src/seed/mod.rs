mod circuits;
mod data;

use self::data::get_prfs_proof_types;

pub enum Endpoint {
    Local,
    Dev,
}

pub async fn upload(endpoint: Endpoint) {
    let proof_types = get_prfs_proof_types();

    println!("proof_types: {:?}", proof_types);
}
