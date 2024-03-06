// use prfs_db_lib::sqlx;
// use prfs_db_lib::sqlx::sqlx_macros::Type;
use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};
use ts_rs::TS;

use prfs_db_lib::sqlx;

#[derive(TS, Clone, Debug, Serialize, Deserialize, sqlx::Type, EnumString, Display)]
#[ts(export)]
#[sqlx(type_name = "VARCHAR")]
pub enum PrfsAtstStatus {
    Valid,
    Invalid,
}
