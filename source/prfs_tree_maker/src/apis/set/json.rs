use crate::paths::PATHS;
use colored::Colorize;
use prfs_entities::entities::PrfsSetType;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct SetJson {
    pub set: SetDetail,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SetDetail {
    pub set_id: uuid::Uuid,
    pub set_type: PrfsSetType,
    pub label: String,
    pub desc: String,
    pub author: String,
    pub src_set_label: String,
    pub where_clause: String,
    pub tree_depth: i16,
    pub hash_algorithm: String,
    pub element_type: String,
    pub cardinality: i64,
    pub created_at: String,
    pub merkle_root: String,
    pub elliptic_curve: String,
    pub finite_field: String,
}

pub fn require_set_json(set_json_path: &String) -> SetJson {
    let set_json_path = PATHS.data.join(set_json_path);
    println!("{} set json, path: {:?}", "Reading".green(), set_json_path,);

    let b = std::fs::read(&set_json_path)
        .expect(&format!("Subset should exist, path: {:?}", set_json_path,));
    let set_json: SetJson = serde_json::from_slice(&b).unwrap();

    println!("set_json: {:#?}", set_json);

    set_json
}
