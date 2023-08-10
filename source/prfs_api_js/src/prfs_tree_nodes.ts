import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

export interface NodePos {
  pos_w: number;
  pos_h: number;
}

export interface GetPrfsTreeNodesRequest {
  set_id: String;
  pos: NodePos[];
}

export type GetPrfsTreeNodesResponse = PrfsApiResponse<{
  set_id: string;
  prfs_tree_nodes: PrfsTreeNode[];
}>;

export async function getPrfsTreeNodes(req: GetPrfsTreeNodesRequest) {
  try {
    let resp: GetPrfsTreeNodesResponse = await api({
      path: `get_prfs_tree_nodes`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
    throw err;
  }
}

export interface GetPrfsTreeLeafNodesRequest {
  set_id: string;
  leaf_vals: string[];
}

export type GetPrfsTreeLeafNodesResponse = PrfsApiResponse<{
  // set_id: string;
  prfs_tree_nodes: PrfsTreeNode[];
}>;

export async function getPrfsTreeLeafNodes(req: GetPrfsTreeLeafNodesRequest) {
  try {
    let resp: GetPrfsTreeLeafNodesResponse = await api({
      path: `get_prfs_tree_leaf_nodes`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
    throw err;
  }
}
