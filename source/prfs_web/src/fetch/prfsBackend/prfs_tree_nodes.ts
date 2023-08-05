import { api } from "./utils";
import { PrfsApiResponse } from "./types";
import { PrfsTreeNode } from "@/models";

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
  }
}
