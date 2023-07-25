use super::json::SetJson;
use crate::TreeMakerError;
use colored::Colorize;
use prfs_db_interface::{database::Database, models::PrfsSet};
use rust_decimal::Decimal;

pub async fn create_set(db: &Database, set_json: &SetJson) -> Result<PrfsSet, TreeMakerError> {
    let prfs_set = PrfsSet {
        set_id: set_json.set.set_id.to_string(),
        label: set_json.set.label.to_string(),
        author: set_json.set.author.to_string(),
        desc: set_json.set.desc.to_string(),
        hash_algorithm: set_json.set.hash_algorithm.to_string(),
        cardinality: Decimal::from(set_json.set.cardinality),
    };

    println!(
        "{} a set, set_id: {}, label: {}",
        "Creating".green(),
        set_json.set.set_id,
        set_json.set.label
    );

    let set_id = db.insert_prfs_set(&prfs_set, false).await.unwrap();
    println!("Inserted prfs_set, id: {:?}", set_id);

    Ok(prfs_set)
}
