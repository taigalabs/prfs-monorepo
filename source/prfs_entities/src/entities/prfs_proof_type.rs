use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize, Serializer};
use serde_json::value::RawValue;
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize)]
#[ts(export)]
pub struct PrfsProofType {
    pub proof_type_id: String,
    pub label: String,
    pub author: String,
    pub desc: String,

    pub circuit_id: String,
    pub driver_id: String,

    #[serde(serialize_with = "serialize_json_value")]
    pub public_input_instance: String,

    #[serde(serialize_with = "serialize_json_value")]
    pub driver_properties: String,

    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,
}

fn serialize_json_value<S>(a: &String, s: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let v: &RawValue = serde_json::from_str(&a).expect(&format!("invalid json, str: {}", a));
    v.serialize(s)
}
