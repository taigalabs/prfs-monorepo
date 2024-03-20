// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CreatePrfsTreeByPrfsSetRequest } from "./CreatePrfsTreeByPrfsSetRequest";
import type { GetLatestPrfsTreeBySetIdRequest } from "./GetLatestPrfsTreeBySetIdRequest";
import type { GetPrfsSetElementRequest } from "./GetPrfsSetElementRequest";
import type { GetPrfsSetElementsRequest } from "./GetPrfsSetElementsRequest";
import type { GetPrfsTreeLeafIndicesRequest } from "./GetPrfsTreeLeafIndicesRequest";
import type { GetPrfsTreeLeafNodesBySetIdRequest } from "./GetPrfsTreeLeafNodesBySetIdRequest";
import type { GetPrfsTreeNodesByPosRequest } from "./GetPrfsTreeNodesByPosRequest";
import type { ImportPrfsAttestationsToPrfsSetRequest } from "./ImportPrfsAttestationsToPrfsSetRequest";
import type { UpdatePrfsTreeNodeRequest } from "./UpdatePrfsTreeNodeRequest";

export type PrfsTreeApiRequest =
  | ({ type: "import_prfs_attestations_to_prfs_set" } & ImportPrfsAttestationsToPrfsSetRequest)
  | ({ type: "get_prfs_set_elements" } & GetPrfsSetElementsRequest)
  | ({ type: "get_prfs_set_element" } & GetPrfsSetElementRequest)
  | ({ type: "create_prfs_tree_by_prfs_set" } & CreatePrfsTreeByPrfsSetRequest)
  | ({ type: "get_prfs_tree_nodes_by_pos" } & GetPrfsTreeNodesByPosRequest)
  | ({ type: "get_prfs_tree_leaf_nodes_by_set_id" } & GetPrfsTreeLeafNodesBySetIdRequest)
  | ({ type: "get_prfs_tree_leaf_indices" } & GetPrfsTreeLeafIndicesRequest)
  | ({ type: "update_prfs_tree_node" } & UpdatePrfsTreeNodeRequest)
  | ({ type: "get_latest_prfs_tree_by_set_id" } & GetLatestPrfsTreeBySetIdRequest);