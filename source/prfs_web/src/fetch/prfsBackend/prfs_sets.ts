import { PrfsSet } from "@/models";
import { api } from "./utils";
import { PrfsApiResponse } from "./types";

export interface GetSetsRequest {
  page: number;
  set_id?: string;
}

export type GetSetsResponse = PrfsApiResponse<{
  page: number;
  sets: PrfsSet[];
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
  set_id?: string;
}

export type GetSetElementsResponse = PrfsApiResponse<{
  page: number;
  elements: [];
}>;

export interface GetSetElementsArgs {
  page: number;
  set_id?: string;
}

export async function getSetElements({ page, set_id }: GetSetElementsArgs) {
  let req: GetSetElementsRequest = {
    page,
    set_id,
  };

  try {
    let resp: GetSetElementsResponse = await api({
      path: "get_prfs_tree_nodes",
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
  }
}
