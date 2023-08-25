import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

export interface GetSetsRequest {
  page_idx: number;
  page_size: number;
  set_id?: string;
}

export type GetSetsResponse = PrfsApiResponse<{
  page: number;
  prfs_sets: PrfsSet[];
}>;

export async function getSets(req: GetSetsRequest) {
  try {
    let resp: GetSetsResponse = await api({
      path: "get_prfs_sets",
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
    throw err;
  }
}

export interface GetSetElementsRequest {
  page_idx: number;
  page_size: number;
  set_id?: string;
}

export type GetSetElementsResponse = PrfsApiResponse<{
  page: number;
  prfs_tree_nodes: PrfsTreeNode[];
}>;

export async function getSetElements(req: GetSetElementsRequest) {
  try {
    let resp: GetSetElementsResponse = await api({
      path: "get_prfs_tree_leaf_nodes_by_set_id",
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
    throw err;
  }
}
