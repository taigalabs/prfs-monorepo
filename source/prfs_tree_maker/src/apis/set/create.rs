use super::json::SetJson;
use crate::TreeMakerError;
use chrono::{DateTime, NaiveDate, Utc};
use colored::Colorize;
use prfs_db_interface::db_apis;
use prfs_entities::entities::PrfsSet;
use prfs_entities::sqlx::{Postgres, Transaction};

pub async fn create_set(
    tx: &mut Transaction<'_, Postgres>,
    set_json: &SetJson,
) -> Result<PrfsSet, TreeMakerError> {
    let created_at = parse_date(&set_json.set.created_at);

    let prfs_set = PrfsSet {
        set_id: uuid::Uuid::default(),
        set_type: set_json.set.set_type.to_string(),
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

    let set_id = db_apis::insert_prfs_set(tx, &prfs_set, false)
        .await
        .unwrap();
    assert!(
        set_id.len() > 0,
        "Set needs to be inserted, set_id: {}",
        set_json.set.set_id
    );

    println!("Inserted prfs_set, id: {:?}", set_id);

    Ok(prfs_set)
}

fn parse_date(date: &str) -> DateTime<Utc> {
    let ymd: Vec<&str> = date.split("/").collect();
    if ymd.len() != 3 {
        panic!("date is invalid, date: {}", date);
    }

    let y: i32 = ymd[0].parse().unwrap();
    let m: u32 = ymd[1].parse().unwrap();
    let d: u32 = ymd[2].parse().unwrap();

    let date = NaiveDate::from_ymd_opt(y, m, d)
        .unwrap()
        .and_hms_opt(0, 0, 0)
        .unwrap();

    DateTime::from_utc(date, Utc)
}
