use prfs_db_driver::sqlx;
use prfs_entities::PrfsAtstMeta;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct GroupMemberRecord {
    pub member_id: String,
    pub member_code: String,
    pub value_raw: String,
}
