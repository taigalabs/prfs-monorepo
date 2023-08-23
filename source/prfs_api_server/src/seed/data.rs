use super::local::load_driver_types;
use crate::seed::local::{load_circuit_input_types, load_circuit_types, load_circuits};
use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use prfs_db_interface::database2::Database2;
use prfs_db_interface::db_apis;
use prfs_entities::entities::PrfsProofType;
use prfs_entities::sqlx::types::Json;
use std::collections::HashMap;

pub async fn upload(db: Database2) {
    let driver_types = load_driver_types();
    println!("driver_types: {:#?}", driver_types);

    // db_apis::insert_

    let circuit_types = load_circuit_types();
    println!("circuit_types: {:#?}", circuit_types);

    let circuit_input_types = load_circuit_input_types();
    println!("circuit_input_types: {:#?}", circuit_input_types);

    let circuits = load_circuits();
    println!("circuits: {:#?}", circuits);
}
