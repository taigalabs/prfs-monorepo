// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CreatePrfsTreeByPrfsSetResponse } from "./CreatePrfsTreeByPrfsSetResponse";
import type { GetLatestPrfsTreeBySetIdResponse } from "./GetLatestPrfsTreeBySetIdResponse";
import type { GetPrfsSetElementResponse } from "./GetPrfsSetElementResponse";
import type { GetPrfsSetElementsResponse } from "./GetPrfsSetElementsResponse";
import type { GetPrfsTreeNodesResponse } from "./GetPrfsTreeNodesResponse";
import type { ImportPrfsAttestationsToPrfsSetResponse } from "./ImportPrfsAttestationsToPrfsSetResponse";
import type { UpdatePrfsTreeNodeResponse } from "./UpdatePrfsTreeNodeResponse";

export type PrfsTreeApiResponse =
  | ({ type: "import_prfs_attestations_to_prfs_set" } & ImportPrfsAttestationsToPrfsSetResponse)
  | ({ type: "get_prfs_set_elements" } & GetPrfsSetElementsResponse)
  | ({ type: "get_prfs_set_element" } & GetPrfsSetElementResponse)
  | ({ type: "create_prfs_tree_by_prfs_set" } & CreatePrfsTreeByPrfsSetResponse)
  | ({ type: "get_prfs_tree_nodes_by_pos" } & GetPrfsTreeNodesResponse)
  | ({ type: "get_prfs_tree_leaf_nodes_by_set_id" } & GetPrfsTreeNodesResponse)
  | ({ type: "get_prfs_tree_leaf_indices" } & GetPrfsTreeNodesResponse)
  | ({ type: "update_prfs_tree_node" } & UpdatePrfsTreeNodeResponse)
  | ({ type: "get_latest_prfs_tree_by_set_id" } & GetLatestPrfsTreeBySetIdResponse);
