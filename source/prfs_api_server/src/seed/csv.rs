use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct GroupMemberRecord {
    pub member_id: String,
    pub member_code: String,
}
