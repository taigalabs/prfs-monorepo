use super::json::{self, SetJson};
use crate::{paths::PATHS, TreeMakerError};
use prfs_db_interface::{
    database::Database,
    models::{PrfsSet, PrfsTreeNode},
};
use rust_decimal::{prelude::FromPrimitive, Decimal};
use std::time::{Duration, SystemTime};

pub async fn create_set(db: &Database, set_json: &SetJson) -> Result<(), TreeMakerError> {
    let prfs_set = PrfsSet {
        id: None,
        label: set_json.set.label.to_string(),
        author: set_json.set.author.to_string(),
        desc: set_json.set.desc.to_string(),
    };

    db.insert_prfs_set(&prfs_set).await.unwrap();

    Ok(())
}
