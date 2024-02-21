// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AddPrfsIndexRequest } from "./AddPrfsIndexRequest";
import type { CreatePrfsDynamicSetElementRequest } from "./CreatePrfsDynamicSetElementRequest";
import type { CreatePrfsPollRequest } from "./CreatePrfsPollRequest";
import type { CreatePrfsProofInstanceRequest } from "./CreatePrfsProofInstanceRequest";
import type { CreatePrfsProofTypeRequest } from "./CreatePrfsProofTypeRequest";
import type { CreatePrfsSetRequest } from "./CreatePrfsSetRequest";
import type { CreatePrfsTreeByPrfsSetRequest } from "./CreatePrfsTreeByPrfsSetRequest";
import type { GetLatestPrfsTreeBySetIdRequest } from "./GetLatestPrfsTreeBySetIdRequest";
import type { GetLeastRecentPrfsIndexRequest } from "./GetLeastRecentPrfsIndexRequest";
import type { GetPrfsCircuitByCircuitIdRequest } from "./GetPrfsCircuitByCircuitIdRequest";
import type { GetPrfsCircuitDriverByDriverIdRequest } from "./GetPrfsCircuitDriverByDriverIdRequest";
import type { GetPrfsCircuitDriversRequest } from "./GetPrfsCircuitDriversRequest";
import type { GetPrfsCircuitTypeByCircuitTypeIdRequest } from "./GetPrfsCircuitTypeByCircuitTypeIdRequest";
import type { GetPrfsCircuitTypesRequest } from "./GetPrfsCircuitTypesRequest";
import type { GetPrfsCircuitsRequest } from "./GetPrfsCircuitsRequest";
import type { GetPrfsIndicesRequest } from "./GetPrfsIndicesRequest";
import type { GetPrfsPollByPollIdRequest } from "./GetPrfsPollByPollIdRequest";
import type { GetPrfsPollsRequest } from "./GetPrfsPollsRequest";
import type { GetPrfsProofInstanceByInstanceIdRequest } from "./GetPrfsProofInstanceByInstanceIdRequest";
import type { GetPrfsProofInstanceByShortIdRequest } from "./GetPrfsProofInstanceByShortIdRequest";
import type { GetPrfsProofInstancesRequest } from "./GetPrfsProofInstancesRequest";
import type { GetPrfsProofTypeByProofTypeIdRequest } from "./GetPrfsProofTypeByProofTypeIdRequest";
import type { GetPrfsProofTypesRequest } from "./GetPrfsProofTypesRequest";
import type { GetPrfsSetBySetIdRequest } from "./GetPrfsSetBySetIdRequest";
import type { GetPrfsSetElementRequest } from "./GetPrfsSetElementRequest";
import type { GetPrfsSetElementsRequest } from "./GetPrfsSetElementsRequest";
import type { GetPrfsSetsBySetTypeRequest } from "./GetPrfsSetsBySetTypeRequest";
import type { GetPrfsSetsRequest } from "./GetPrfsSetsRequest";
import type { GetPrfsTreeLeafIndicesRequest } from "./GetPrfsTreeLeafIndicesRequest";
import type { GetPrfsTreeLeafNodesBySetIdRequest } from "./GetPrfsTreeLeafNodesBySetIdRequest";
import type { GetPrfsTreeNodesByPosRequest } from "./GetPrfsTreeNodesByPosRequest";
import type { ImportPrfsSetElementsRequest } from "./ImportPrfsSetElementsRequest";
import type { PrfsIdentitySignUpRequest } from "./PrfsIdentitySignUpRequest";
import type { PrfsSignInRequest } from "./PrfsSignInRequest";
import type { SubmitPrfsPollResponseRequest } from "./SubmitPrfsPollResponseRequest";
import type { UpdatePrfsTreeNodeRequest } from "./UpdatePrfsTreeNodeRequest";

export type PrfsApiRequest =
  | ({ type: "GetPrfsCircuits" } & GetPrfsCircuitsRequest)
  | ({ type: "GetPrfsCircuitByCircuitId" } & GetPrfsCircuitByCircuitIdRequest)
  | ({ type: "sign_in_prfs_account" } & PrfsSignInRequest)
  | ({ type: "sign_up_prfs_account" } & PrfsIdentitySignUpRequest)
  | ({ type: "GetPrfsCircuitDrivers" } & GetPrfsCircuitDriversRequest)
  | ({ type: "GetPrfsCircuitDriverByDriverId" } & GetPrfsCircuitDriverByDriverIdRequest)
  | ({ type: "GetPrfsCircuitTypes" } & GetPrfsCircuitTypesRequest)
  | ({ type: "GetPrfsCircuitTypeByCircuitTypeId" } & GetPrfsCircuitTypeByCircuitTypeIdRequest)
  | ({ type: "get_least_recent_prfs_index" } & GetLeastRecentPrfsIndexRequest)
  | ({ type: "get_prfs_indices" } & GetPrfsIndicesRequest)
  | ({ type: "add_prfs_index" } & AddPrfsIndexRequest)
  | ({ type: "GetPrfsPolls" } & GetPrfsPollsRequest)
  | ({ type: "CreatePrfsPoll" } & CreatePrfsPollRequest)
  | ({ type: "GetPrfsPollByPollId" } & GetPrfsPollByPollIdRequest)
  | ({ type: "SubmitPrfsPollResponse" } & SubmitPrfsPollResponseRequest)
  | ({ type: "GetPrfsProofInstances" } & GetPrfsProofInstancesRequest)
  | ({ type: "get_prfs_proof_instance_by_instance_id" } & GetPrfsProofInstanceByInstanceIdRequest)
  | ({ type: "get_prfs_proof_instance_by_short_id" } & GetPrfsProofInstanceByShortIdRequest)
  | ({ type: "create_prfs_proof_instance" } & CreatePrfsProofInstanceRequest)
  | ({ type: "get_prfs_proof_types" } & GetPrfsProofTypesRequest)
  | ({ type: "get_prfs_proof_type_by_proof_type_id" } & GetPrfsProofTypeByProofTypeIdRequest)
  | ({ type: "CreatePrfsProofType" } & CreatePrfsProofTypeRequest)
  | ({ type: "get_prfs_set_by_set_id" } & GetPrfsSetBySetIdRequest)
  | ({ type: "GetPrfsSets" } & GetPrfsSetsRequest)
  | ({ type: "GetPrfsSetsBySetType" } & GetPrfsSetsBySetTypeRequest)
  | ({ type: "create_prfs_set" } & CreatePrfsSetRequest)
  | ({ type: "CreatePrfsDynamicSetElement" } & CreatePrfsDynamicSetElementRequest)
  | ({ type: "create_prfs_tree_by_prfs_set" } & CreatePrfsTreeByPrfsSetRequest)
  | ({ type: "import_prfs_set_elements" } & ImportPrfsSetElementsRequest)
  | ({ type: "get_prfs_set_elements" } & GetPrfsSetElementsRequest)
  | ({ type: "get_prfs_set_element" } & GetPrfsSetElementRequest)
  | ({ type: "get_prfs_tree_nodes_by_pos" } & GetPrfsTreeNodesByPosRequest)
  | ({ type: "GetPrfsTreeLeafNodesBySetId" } & GetPrfsTreeLeafNodesBySetIdRequest)
  | ({ type: "get_prfs_tree_leaf_indices" } & GetPrfsTreeLeafIndicesRequest)
  | ({ type: "UpdatePrfsTreeNode" } & UpdatePrfsTreeNodeRequest)
  | ({ type: "get_latest_prfs_tree_by_set_id" } & GetLatestPrfsTreeBySetIdRequest);