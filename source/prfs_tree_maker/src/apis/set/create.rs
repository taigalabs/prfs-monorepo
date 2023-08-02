use super::json::SetJson;
use crate::TreeMakerError;
use chrono::NaiveDate;
use colored::Colorize;
use prfs_db_interface::{database2::Database2, entities::PrfsSet};

pub async fn create_set(db: &Database2, set_json: &SetJson) -> Result<PrfsSet, TreeMakerError> {
    let created_at = parse_date(&set_json.set.created_at);

    let prfs_set = PrfsSet {
        set_id: set_json.set.set_id.to_string(),
        label: set_json.set.label.to_string(),
        author: set_json.set.author.to_string(),
        desc: set_json.set.desc.to_string(),
        hash_algorithm: set_json.set.hash_algorithm.to_string(),
        cardinality: set_json.set.cardinality,
        merkle_root: set_json.set.merkle_root.to_string(),
        element_type: set_json.set.element_type.to_string(),
        elliptic_curve: set_json.set.elliptic_curve.to_string(),
        finite_field: set_json.set.finite_field.to_string(),
        created_at,
    };

    println!(
        "{} a set, set_id: {}, label: {}",
        "Creating".green(),
        set_json.set.set_id,
        set_json.set.label
    );

    let set_id = db.insert_prfs_set(&prfs_set, false).await.unwrap();
    assert!(
        set_id.len() > 0,
        "Set needs to be inserted, set_id: {}",
        set_json.set.set_id
    );

    println!("Inserted prfs_set, id: {:?}", set_id);

    Ok(prfs_set)
}

fn parse_date(date: &str) -> NaiveDate {
    let ymd: Vec<&str> = date.split("/").collect();
    if ymd.len() != 3 {
        panic!("date is invalid, date: {}", date);
    }

    let y: i32 = ymd[0].parse().unwrap();
    let m: u32 = ymd[1].parse().unwrap();
    let d: u32 = ymd[2].parse().unwrap();

    NaiveDate::from_ymd_opt(y, m, d).unwrap()
}
