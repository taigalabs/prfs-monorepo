use crate::paths::PATHS;
use colored::Colorize;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct SubsetJson {
    pub set_id: String,
    pub where_clause: String,
    pub tree_depth: u32,
}

pub fn require_subset_json(subset_json_filename: String) -> SubsetJson {
    let subset_json_path = PATHS.data.join(&subset_json_filename);
    println!(
        "{} subset json, path: {}",
        "Reading".green(),
        subset_json_filename
    );

    let b = std::fs::read(&subset_json_path).expect(&format!(
        "Subset should exist, path: {:?}",
        subset_json_path,
    ));
    let subset_json: SubsetJson = serde_json::from_slice(&b).unwrap();

    println!("subset_json: {:#?}", subset_json);

    subset_json
}
