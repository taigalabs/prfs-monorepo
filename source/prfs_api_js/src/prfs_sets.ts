import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";
import { GetPrfsSetsRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetsRequest";
import { GetPrfsSetsResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsSetsResponse";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";
import { GetPrfsSetBySetIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdResponse";
import { GetPrfsTreeNodesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesResponse";
import { GetPrfsTreeLeafNodesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafNodesRequest";
// import { GetPrfsTreeNodesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesResponse";
// import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTree";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

// export interface GetSetsRequest {
//   page_idx: number;
//   page_size: number;
//   set_id?: string;
// }

// export type GetSetsResponse = PrfsApiResponse<{
//   page: number;
//   prfs_sets: PrfsSet[];
// }>;

export async function getPrfsSets(req: GetPrfsSetsRequest) {
  return (await api({
    path: "get_prfs_sets",
    req,
  })) as PrfsApiResponse<GetPrfsSetsResponse>;
}

// export interface GetPrfsSetBySetIdRequest {
//   page_idx: number;
//   page_size: number;
//   set_id: string;
// }

export async function getPrfsSetBySetId(req: GetPrfsSetBySetIdRequest) {
  return (await api({
    path: "get_prfs_set_by_set_id",
    req,
  })) as PrfsApiResponse<GetPrfsSetBySetIdResponse>;
}

// export interface GetSetElementsRequest {
//   page_idx: number;
//   page_size: number;
//   set_id?: string;
// }

// export type GetSetElementsResponse = PrfsApiResponse<{
//   page: number;
//   prfs_tree_nodes: PrfsTreeNode[];
// }>;

export async function getPrfsSetElements(req: GetPrfsTreeLeafNodesRequest) {
  return (await api({
    path: "get_prfs_tree_leaf_nodes",
    req,
  })) as PrfsApiResponse<GetPrfsTreeNodesResponse>;
}
