use crate::paths::PATHS;
use colored::Colorize;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct SetJson {
    pub set: SetDetail,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SetDetail {
    pub label: String,
    pub desc: String,
    pub author: String,
    pub src_set_label: String,
    pub where_clause: String,
    pub tree_depth: u32,
}

pub fn require_set_json(subset_json_filename: String) -> SetJson {
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
    let set_json: SetJson = serde_json::from_slice(&b).unwrap();

    println!("set_json: {:#?}", set_json);

    set_json
}
