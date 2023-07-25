use crate::{paths::PATHS, TreeMakerError};
use prfs_db_interface::database::Database;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ProofTypeJson {
    pub set_id: String,
    pub where_clause: String,
    pub tree_depth: u32,
}

pub fn read_subset_file(subset_filename: String) -> Result<ProofTypeJson, TreeMakerError> {
    println!("subset_filename: {}", subset_filename);

    let subset_json_path = PATHS.data.join(subset_filename);

    let subset_json_bytes = std::fs::read(&subset_json_path).expect(&format!(
        "Subset should exist, path: {:?}",
        subset_json_path,
    ));

    let subset_json: ProofTypeJson = serde_json::from_slice(&subset_json_bytes).unwrap();

    println!("subset_json: {:?}", subset_json);

    Ok(subset_json)
}
