use super::json::SetJson;
use crate::TreeMakerError;
use prfs_db_interface::{database::Database, models::PrfsSet};

pub async fn create_set(db: &Database, set_json: &SetJson) -> Result<String, TreeMakerError> {
    let prfs_set = PrfsSet {
        set_id: set_json.set.set_id.to_string(),
        label: set_json.set.label.to_string(),
        author: set_json.set.author.to_string(),
        desc: set_json.set.desc.to_string(),
    };

    let set_id = db.insert_prfs_set(&prfs_set).await.unwrap();
    println!("Inserted prfs_set, id: {:?}", set_id);

    Ok(set_id)
}
