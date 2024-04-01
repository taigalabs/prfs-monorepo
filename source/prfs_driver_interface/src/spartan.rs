use serde::{Deserialize, Serialize};
use sqlx::Type;
use strum_macros::{EnumString, ToString};
use ts_rs::TS;

#[derive(Debug, EnumString, Serialize, Deserialize, Clone, Type, TS)]
#[allow(non_camel_case_types)]
#[sqlx(type_name = "VARCHAR")]
#[ts(export)]
pub enum CircuitDriverId {
    spartan_circom_v1,
    o1js_v1,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type, TS)]
#[ts(export)]
pub struct SpartanCircomDriverProperties {
    version: String,
    wtns_gen_url: String,
    circuit_url: String,
}
