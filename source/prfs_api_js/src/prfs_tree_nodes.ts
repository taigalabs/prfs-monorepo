import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";
import { GetPrfsTreeLeafNodesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafNodesRequest";
import { GetPrfsTreeLeafIndicesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafIndicesRequest";
import { GetPrfsTreeNodesByPosRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesByPosRequest";
import { GetPrfsTreeNodesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesResponse";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

export async function getPrfsTreeNodesByPos(req: GetPrfsTreeNodesByPosRequest) {
  return (await api({
    path: `get_prfs_tree_nodes_by_pos`,
    req,
  })) as PrfsApiResponse<GetPrfsTreeNodesResponse>;
}

export async function getPrfsTreeLeafNodesBySetId(req: GetPrfsTreeLeafNodesRequest) {
  return (await api({
    path: `get_prfs_tree_leaf_nodes_by_set_id`,
    req,
  })) as PrfsApiResponse<GetPrfsTreeNodesResponse>;
}

export async function getPrfsTreeLeafIndicesRequest(req: GetPrfsTreeLeafIndicesRequest) {
  return (await api({
    path: `get_prfs_tree_leaf_indices`,
    req,
  })) as PrfsApiResponse<GetPrfsTreeNodesResponse>;
}
