use crate::paths::PATHS;
use colored::Colorize;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct SetJson {
    pub set: SetDetail,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SetDetail {
    pub set_id: String,
    pub label: String,
    pub desc: String,
    pub author: String,
    pub src_set_label: String,
    pub where_clause: String,
    pub tree_depth: u32,
    pub hash_algorithm: String,
    pub cardinality: Decimal,
}

pub fn require_set_json(set_json_path: String) -> SetJson {
    let set_json_path = PATHS.manifest_dir.join(&set_json_path);
    println!("{} set json, path: {:?}", "Reading".green(), set_json_path,);

    let b = std::fs::read(&set_json_path)
        .expect(&format!("Subset should exist, path: {:?}", set_json_path,));
    let set_json: SetJson = serde_json::from_slice(&b).unwrap();

    println!("set_json: {:#?}", set_json);

    set_json
}
