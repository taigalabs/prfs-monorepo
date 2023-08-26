use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::entities::PrfsTreeNode;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct NodePos {
    #[ts(type = "number")]
    pub pos_w: Decimal,
    pub pos_h: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsTreeNodesByPosRequest {
    pub set_id: String,
    pub pos: Vec<NodePos>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsTreeNodesResponse {
    pub prfs_tree_nodes: Vec<PrfsTreeNode>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsTreeLeafNodesRequest {
    pub page_idx: i32,
    pub page_size: i32,

    #[ts(type = "'<Uuid>' | string")]
    pub set_id: Uuid,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsTreeLeafIndicesRequest {
    pub set_id: String,
    pub leaf_vals: Vec<String>,
}
