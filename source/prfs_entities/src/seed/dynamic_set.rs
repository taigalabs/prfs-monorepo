use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::PrfsSet;

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export)]
pub struct DynamicSetJson {
    pub prfs_set: PrfsSet,
    pub elements_path: String,
}
