// import { PrfsSet, PrfsTreeNode } from "@/models";
import { api } from "./utils";
import { PrfsApiResponse } from "./types";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";

export interface GetSetsRequest {
  page: number;
  set_id?: string;
}

export type GetSetsResponse = PrfsApiResponse<{
  page: number;
  prfs_sets: PrfsSet[];
}>;

export interface GetSetsArgs {
  page: number;
  set_id?: string;
}

export async function getSets({ page, set_id }: GetSetsArgs) {
  let req: GetSetsRequest = {
    page,
    set_id,
  };

  try {
    let resp: GetSetsResponse = await api({
      path: "get_prfs_sets",
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
  }
}

export interface GetSetElementsRequest {
  page: number;
  limit: number;
  set_id?: string;
}

export type GetSetElementsResponse = PrfsApiResponse<{
  page: number;
  prfs_tree_nodes: PrfsTreeNode[];
}>;

export interface GetSetElementsArgs {
  page: number;
  limit: number;
  set_id?: string;
}

export async function getSetElements({ page, set_id, limit }: GetSetElementsArgs) {
  let req: GetSetElementsRequest = {
    page,
    limit,
    set_id,
  };

  try {
    let resp: GetSetElementsResponse = await api({
      path: "get_prfs_tree_leaf_nodes_by_set_id",
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
  }
}
