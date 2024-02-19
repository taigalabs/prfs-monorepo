// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AddPrfsIndexRequest } from "./AddPrfsIndexRequest";
import type { CreatePrfsDynamicSetElementRequest } from "./CreatePrfsDynamicSetElementRequest";
import type { CreatePrfsPollRequest } from "./CreatePrfsPollRequest";
import type { CreatePrfsProofInstanceRequest } from "./CreatePrfsProofInstanceRequest";
import type { CreatePrfsProofTypeRequest } from "./CreatePrfsProofTypeRequest";
import type { CreatePrfsSetRequest } from "./CreatePrfsSetRequest";
import type { CreateTreeOfPrfsSetRequest } from "./CreateTreeOfPrfsSetRequest";
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
import type { GetPrfsSetElementsRequest } from "./GetPrfsSetElementsRequest";
import type { GetPrfsSetsBySetTypeRequest } from "./GetPrfsSetsBySetTypeRequest";
import type { GetPrfsSetsRequest } from "./GetPrfsSetsRequest";
import type { GetPrfsTreeLeafIndicesRequest } from "./GetPrfsTreeLeafIndicesRequest";
import type { GetPrfsTreeLeafNodesBySetIdRequest } from "./GetPrfsTreeLeafNodesBySetIdRequest";
import type { GetPrfsTreeNodesByPosRequest } from "./GetPrfsTreeNodesByPosRequest";
import type { ImportPrfsSetElementsRequest } from "./ImportPrfsSetElementsRequest";
import type { PrfsIdentitySignUpRequest } from "./PrfsIdentitySignUpRequest";
import type { SubmitPrfsPollResponseRequest } from "./SubmitPrfsPollResponseRequest";
import type { UpdatePrfsTreeNodeRequest } from "./UpdatePrfsTreeNodeRequest";

export type PrfsApiRequest =
  | ({ type: "get_prfs_circuits" } & GetPrfsCircuitsRequest)
  | ({ type: "get_prfs_circuit_by_circuit_id" } & GetPrfsCircuitByCircuitIdRequest)
  | ({ type: "prfs_identity_sign_up" } & PrfsIdentitySignUpRequest)
  | ({ type: "get_prfs_circuit_drivers" } & GetPrfsCircuitDriversRequest)
  | ({ type: "get_prfs_circuit_driver_by_driver_id" } & GetPrfsCircuitDriverByDriverIdRequest)
  | ({ type: "get_prfs_circuit_types" } & GetPrfsCircuitTypesRequest)
  | ({
      type: "get_prfs_circuit_type_by_circuit_type_id";
    } & GetPrfsCircuitTypeByCircuitTypeIdRequest)
  | ({ type: "get_least_recent_prfs_index" } & GetLeastRecentPrfsIndexRequest)
  | ({ type: "get_prfs_indices" } & GetPrfsIndicesRequest)
  | ({ type: "add_prfs_index" } & AddPrfsIndexRequest)
  | ({ type: "get_prfs_polls" } & GetPrfsPollsRequest)
  | ({ type: "create_prfs_poll" } & CreatePrfsPollRequest)
  | ({ type: "get_prfs_poll_by_poll_id" } & GetPrfsPollByPollIdRequest)
  | ({ type: "submit_prfs_poll_response" } & SubmitPrfsPollResponseRequest)
  | ({ type: "get_prfs_proof_instances" } & GetPrfsProofInstancesRequest)
  | ({ type: "get_prfs_proof_instance_by_instance_id" } & GetPrfsProofInstanceByInstanceIdRequest)
  | ({ type: "get_prfs_proof_instance_by_short_id" } & GetPrfsProofInstanceByShortIdRequest)
  | ({ type: "create_prfs_proof_instance" } & CreatePrfsProofInstanceRequest)
  | ({ type: "get_prfs_proof_types" } & GetPrfsProofTypesRequest)
  | ({ type: "get_prfs_proof_type_by_proof_type_id" } & GetPrfsProofTypeByProofTypeIdRequest)
  | ({ type: "create_prfs_proof_type" } & CreatePrfsProofTypeRequest)
  | ({ type: "get_prfs_set_by_set_id" } & GetPrfsSetBySetIdRequest)
  | ({ type: "get_prfs_sets" } & GetPrfsSetsRequest)
  | ({ type: "get_prfs_sets_by_set_type" } & GetPrfsSetsBySetTypeRequest)
  | ({ type: "create_prfs_set" } & CreatePrfsSetRequest)
  | ({ type: "create_prfs_dynamic_set_element" } & CreatePrfsDynamicSetElementRequest)
  | ({ type: "create_tree_of_prfs_set" } & CreateTreeOfPrfsSetRequest)
  | ({ type: "import_prfs_set_elements" } & ImportPrfsSetElementsRequest)
  | ({ type: "get_prfs_set_elements" } & GetPrfsSetElementsRequest)
  | ({ type: "get_prfs_set_element" } & GetPrfsSetElementsRequest)
  | ({ type: "get_prfs_tree_nodes_by_pos" } & GetPrfsTreeNodesByPosRequest)
  | ({ type: "get_prfs_tree_leaf_nodes_by_set_id" } & GetPrfsTreeLeafNodesBySetIdRequest)
  | ({ type: "get_prfs_tree_leaf_indices" } & GetPrfsTreeLeafIndicesRequest)
  | ({ type: "update_prfs_tree_node" } & UpdatePrfsTreeNodeRequest);
