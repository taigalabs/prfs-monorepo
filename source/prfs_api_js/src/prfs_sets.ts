import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";
import { GetPrfsSetsRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetsRequest";
import { GetPrfsSetsBySetTypeRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetsBySetTypeRequest";
import { GetPrfsSetsResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsSetsResponse";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";
import { GetPrfsSetBySetIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdResponse";
import { GetPrfsTreeNodesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesResponse";
import { GetPrfsTreeLeafNodesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafNodesRequest";
import { CreatePrfsSetRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsSetRequest";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

export async function getPrfsSets(req: GetPrfsSetsRequest) {
  return (await api({
    path: "get_prfs_sets",
    req,
  })) as PrfsApiResponse<GetPrfsSetsResponse>;
}

export async function createPrfsSet(req: CreatePrfsSetRequest) {
  return (await api({
    path: "create_prfs_set",
    req,
  })) as PrfsApiResponse<GetPrfsSetsResponse>;
}

export async function getPrfsSetsBySetType(req: GetPrfsSetsBySetTypeRequest) {
  return (await api({
    path: "get_prfs_sets_by_set_type",
    req,
  })) as PrfsApiResponse<GetPrfsSetsResponse>;
}

export async function getPrfsSetBySetId(req: GetPrfsSetBySetIdRequest) {
  return (await api({
    path: "get_prfs_set_by_set_id",
    req,
  })) as PrfsApiResponse<GetPrfsSetBySetIdResponse>;
}
