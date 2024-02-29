use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct DateTimed<T> {
    pub inner: T,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
