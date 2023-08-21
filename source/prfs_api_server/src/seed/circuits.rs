use std::collections::HashMap;

use chrono::{TimeZone, Utc};
use prfs_entities::entities::{CircuitInputMeta, PrfsCircuit};
use prfs_entities::sqlx;
use prfs_entities::sqlx::types::Json;
use serde_json::json;

pub fn load_circuits() {
    let created_at = Utc.with_ymd_and_hms(2020, 1, 1, 0, 0, 0).unwrap();
}
