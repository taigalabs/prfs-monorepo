use super::local::load_driver_types;
use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use prfs_db_interface::database2::Database2;
use prfs_entities::entities::PrfsProofType;
use prfs_entities::sqlx::types::Json;
use std::collections::HashMap;

pub async fn upload(db: Database2) {
    let driver_types = load_driver_types();
    println!("driver_types: {:#?}", driver_types);
}
