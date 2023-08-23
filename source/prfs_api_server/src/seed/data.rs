use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use prfs_db_interface::database2::Database2;
use prfs_entities::entities::PrfsProofType;
use prfs_entities::sqlx::types::Json;
use std::collections::HashMap;

pub async fn upload(db: Database2) {
    let datetime = Utc.with_ymd_and_hms(2023, 7, 8, 9, 10, 11).unwrap();

    let proof_type_id = uuid::Uuid::from_u128(0);

    let pt = PrfsProofType {
        proof_type_id,
        label: String::from(""),
        author: String::from(""),
        desc: String::from(""),
        circuit_id: String::from(""),
        driver_id: String::from(""),
        img_caption: Some(String::from("")),
        img_url: Some(String::from("")),
        expression: String::from(""),
        circuit_inputs: Json::from(HashMap::new()),
        driver_properties: Json::from(HashMap::new()),
        created_at: datetime,
    };
}
