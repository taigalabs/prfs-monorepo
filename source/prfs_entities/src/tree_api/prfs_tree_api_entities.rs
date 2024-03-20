use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{
    GetPrfsSetElementRequest, GetPrfsSetElementResponse, GetPrfsSetElementsRequest,
    GetPrfsSetElementsResponse,
};
use crate::{
    CreatePrfsTreeByPrfsSetRequest, CreatePrfsTreeByPrfsSetResponse,
    GetLatestPrfsTreeBySetIdRequest, GetLatestPrfsTreeBySetIdResponse,
    GetPrfsTreeLeafIndicesRequest, GetPrfsTreeLeafNodesBySetIdRequest,
    GetPrfsTreeNodesByPosRequest, GetPrfsTreeNodesResponse, ImportPrfsAttestationsToPrfsSetRequest,
    ImportPrfsAttestationsToPrfsSetResponse, UpdatePrfsTreeNodeRequest, UpdatePrfsTreeNodeResponse,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsTreeApiRequest {
    import_prfs_attestations_to_prfs_set(ImportPrfsAttestationsToPrfsSetRequest),
    get_prfs_set_elements(GetPrfsSetElementsRequest),
    get_prfs_set_element(GetPrfsSetElementRequest),
    create_prfs_tree_by_prfs_set(CreatePrfsTreeByPrfsSetRequest),
    get_prfs_tree_nodes_by_pos(GetPrfsTreeNodesByPosRequest),
    get_prfs_tree_leaf_nodes_by_set_id(GetPrfsTreeLeafNodesBySetIdRequest),
    get_prfs_tree_leaf_indices(GetPrfsTreeLeafIndicesRequest),
    update_prfs_tree_node(UpdatePrfsTreeNodeRequest),
    get_latest_prfs_tree_by_set_id(GetLatestPrfsTreeBySetIdRequest),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsTreeApiResponse {
    import_prfs_attestations_to_prfs_set(ImportPrfsAttestationsToPrfsSetResponse),
    get_prfs_set_elements(GetPrfsSetElementsResponse),
    get_prfs_set_element(GetPrfsSetElementResponse),
    create_prfs_tree_by_prfs_set(CreatePrfsTreeByPrfsSetResponse),
    get_prfs_tree_nodes_by_pos(GetPrfsTreeNodesResponse),
    get_prfs_tree_leaf_nodes_by_set_id(GetPrfsTreeNodesResponse),
    get_prfs_tree_leaf_indices(GetPrfsTreeNodesResponse),
    update_prfs_tree_node(UpdatePrfsTreeNodeResponse),
    get_latest_prfs_tree_by_set_id(GetLatestPrfsTreeBySetIdResponse),
}
