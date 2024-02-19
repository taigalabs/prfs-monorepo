import prfs_api_error_codes from "@taigalabs/prfs-api-server/data_api/error_codes.json";
import { PrfsApiRequest } from "@taigalabs/prfs-entities/bindings/PrfsApiRequest";

import { api } from "../utils";
import { PrfsApiResponse } from "../types";
import { PrfsSignUpRequest } from "@taigalabs/prfs-entities/bindings/PrfsSignUpRequest";

// type RequestName =
//   | "sign_up_prfs_account"
//   | "sign_in_prfs_account"
//   | "get_prfs_circuit_drivers"
//   | "get_prfs_circuit_driver_by_driver_id"
//   | "get_prfs_circuit_types"
//   | "get_prfs_circuit_type_by_circuit_type_id"
//   | "get_prfs_circuits"
//   | "get_prfs_circuit_by_circuit_id"
//   | "create_prfs_proof_instance"
//   | "get_prfs_proof_instances"
//   | "get_prfs_proof_instance_by_instance_id"
//   | "get_prfs_proof_instance_by_short_id"
//   | "create_prfs_proof_type"
//   | "get_prfs_proof_types"
//   | "get_prfs_proof_type_by_proof_type_id"
//   | "get_prfs_sets"
//   | "create_prfs_set"
//   | "get_prfs_sets_by_set_type"
//   | "get_prfs_set_by_set_id"
//   | "create_prfs_dynamic_set_element"
//   | "get_prfs_tree_nodes_by_pos"
//   | "get_prfs_tree_leaf_nodes_by_set_id"
//   | "get_prfs_tree_leaf_indices"
//   | "update_prfs_tree_node"
//   // | "compute_prfs_set_merkle_root"
//   | "create_prfs_poll"
//   | "get_prfs_polls"
//   | "get_prfs_poll_by_poll_id"
//   | "submit_prfs_poll_response"
//   | "get_prfs_poll_result_by_poll_id"
//   | "create_social_post"
//   | "get_social_posts"
//   | "import_prfs_set_elements"
//   | "get_prfs_set_elements"
//   | "get_prfs_set_element"
//   | "create_tree_of_prfs_set"
//   | "get_least_recent_prfs_index"
//   | "get_prfs_indices"
//   | "add_prfs_index";

// type Req<T extends RequestName> = //
//   T extends "sign_up_prfs_account"
//     ? PrfsSignUpRequest
//     : T extends "sign_in_prfs_account"
//     ? PrfsSignInRequest
//     : T extends "get_prfs_circuit_drivers"
//     ? GetPrfsCircuitDriversRequest
//     : T extends "get_prfs_circuit_driver_by_driver_id"
//     ? GetPrfsCircuitDriverByDriverIdRequest
//     : T extends "get_prfs_circuit_types"
//     ? GetPrfsCircuitTypesRequest
//     : T extends "get_prfs_circuit_type_by_circuit_type_id"
//     ? GetPrfsCircuitTypeByCircuitTypeIdRequest
//     : T extends "get_prfs_circuits"
//     ? GetPrfsCircuitsRequest
//     : T extends "get_prfs_circuit_by_circuit_id"
//     ? GetPrfsCircuitByCircuitIdRequest
//     : T extends "create_prfs_proof_instance"
//     ? CreatePrfsProofInstanceRequest
//     : T extends "get_prfs_proof_instances"
//     ? GetPrfsProofInstancesRequest
//     : T extends "get_prfs_proof_instance_by_instance_id"
//     ? GetPrfsProofInstanceByInstanceIdRequest
//     : T extends "get_prfs_proof_instance_by_short_id"
//     ? GetPrfsProofInstanceByShortIdRequest
//     : T extends "create_prfs_proof_type"
//     ? CreatePrfsProofTypeRequest
//     : T extends "get_prfs_proof_types"
//     ? GetPrfsProofTypesRequest
//     : T extends "get_prfs_proof_type_by_proof_type_id"
//     ? GetPrfsProofTypeByProofTypeIdRequest
//     : T extends "get_prfs_sets"
//     ? GetPrfsSetsRequest
//     : T extends "create_prfs_set"
//     ? CreatePrfsSetRequest
//     : T extends "get_prfs_sets_by_set_type"
//     ? GetPrfsSetsBySetTypeRequest
//     : T extends "get_prfs_set_by_set_id"
//     ? GetPrfsSetBySetIdRequest
//     : T extends "create_prfs_dynamic_set_element"
//     ? CreatePrfsDynamicSetElementRequest
//     : T extends "get_prfs_tree_nodes_by_pos"
//     ? GetPrfsTreeNodesByPosRequest
//     : T extends "get_prfs_tree_leaf_nodes_by_set_id"
//     ? GetPrfsTreeLeafNodesBySetIdRequest
//     : T extends "get_prfs_tree_leaf_indices"
//     ? GetPrfsTreeLeafIndicesRequest
//     : T extends "update_prfs_tree_node"
//     ? UpdatePrfsTreeNodeRequest
//     : // : T extends "compute_prfs_set_merkle_root"
//     // ? ComputePrfsSetMerkleRootRequest
//     T extends "create_prfs_poll"
//     ? CreatePrfsPollRequest
//     : T extends "get_prfs_polls"
//     ? GetPrfsPollsRequest
//     : T extends "get_prfs_poll_by_poll_id"
//     ? GetPrfsPollByPollIdRequest
//     : T extends "submit_prfs_poll_response"
//     ? SubmitPrfsPollResponseRequest
//     : T extends "get_prfs_poll_result_by_poll_id"
//     ? GetPrfsPollResultByPollIdRequest
//     : T extends "import_prfs_set_elements"
//     ? ImportPrfsSetElementsRequest
//     : T extends "get_prfs_set_elements"
//     ? GetPrfsSetElementsRequest
//     : T extends "get_prfs_set_element"
//     ? GetPrfsSetElementRequest
//     : T extends "create_tree_of_prfs_set"
//     ? CreateTreeOfPrfsSetRequest
//     : T extends "get_least_recent_prfs_index"
//     ? GetLeastRecentPrfsIndexRequest
//     : T extends "get_prfs_indices"
//     ? GetPrfsIndicesRequest
//     : T extends "add_prfs_index"
//     ? AddPrfsIndexRequest
//     : never;

// type Resp<T> = //
//   T extends "sign_up_prfs_account"
//     ? PrfsApiResponse<PrfsSignUpResponse>
//     : T extends "sign_in_prfs_account"
//     ? PrfsApiResponse<PrfsSignInResponse>
//     : T extends "get_prfs_circuit_drivers"
//     ? PrfsApiResponse<GetPrfsCircuitDriversResponse>
//     : T extends "get_prfs_circuit_driver_by_driver_id"
//     ? PrfsApiResponse<GetPrfsCircuitDriverByDriverIdResponse>
//     : T extends "get_prfs_circuit_types"
//     ? PrfsApiResponse<GetPrfsCircuitTypesResponse>
//     : T extends "get_prfs_circuit_type_by_circuit_type_id"
//     ? PrfsApiResponse<GetPrfsCircuitTypeByCircuitTypeIdResponse>
//     : T extends "get_prfs_circuits"
//     ? PrfsApiResponse<GetPrfsCircuitsResponse>
//     : T extends "get_prfs_circuit_by_circuit_id"
//     ? PrfsApiResponse<GetPrfsCircuitByCircuitIdResponse>
//     : T extends "create_prfs_proof_instance"
//     ? PrfsApiResponse<CreatePrfsProofInstanceResponse>
//     : T extends "get_prfs_proof_instances"
//     ? PrfsApiResponse<GetPrfsProofInstancesResponse>
//     : T extends "get_prfs_proof_instance_by_instance_id"
//     ? PrfsApiResponse<GetPrfsProofInstanceByInstanceIdResponse>
//     : T extends "get_prfs_proof_instance_by_short_id"
//     ? PrfsApiResponse<GetPrfsProofInstanceByShortIdResponse>
//     : T extends "create_prfs_proof_type"
//     ? PrfsApiResponse<CreatePrfsProofTypeResponse>
//     : T extends "get_prfs_proof_types"
//     ? PrfsApiResponse<GetPrfsProofTypesResponse>
//     : T extends "get_prfs_proof_type_by_proof_type_id"
//     ? PrfsApiResponse<GetPrfsProofTypeByProofTypeIdResponse>
//     : T extends "get_prfs_sets"
//     ? PrfsApiResponse<GetPrfsSetsResponse>
//     : T extends "create_prfs_set"
//     ? PrfsApiResponse<CreatePrfsSetResponse>
//     : T extends "get_prfs_sets_by_set_type"
//     ? PrfsApiResponse<GetPrfsSetsResponse>
//     : T extends "get_prfs_set_by_set_id"
//     ? PrfsApiResponse<GetPrfsSetBySetIdResponse>
//     : T extends "create_prfs_dynamic_set_element"
//     ? PrfsApiResponse<CreatePrfsDynamicSetElementResponse>
//     : T extends "get_prfs_tree_nodes_by_pos"
//     ? PrfsApiResponse<GetPrfsTreeNodesResponse>
//     : T extends "get_prfs_tree_leaf_nodes_by_set_id"
//     ? PrfsApiResponse<GetPrfsTreeNodesResponse>
//     : T extends "get_prfs_tree_leaf_indices"
//     ? PrfsApiResponse<GetPrfsTreeNodesResponse>
//     : T extends "update_prfs_tree_node"
//     ? PrfsApiResponse<UpdatePrfsTreeNodeResponse>
//     : // : T extends "compute_prfs_set_merkle_root"
//     // ? PrfsApiResponse<ComputePrfsSetMerkleRootResponse>
//     T extends "create_prfs_poll"
//     ? PrfsApiResponse<CreatePrfsPollResponse>
//     : T extends "get_prfs_polls"
//     ? PrfsApiResponse<GetPrfsPollsResponse>
//     : T extends "get_prfs_poll_by_poll_id"
//     ? PrfsApiResponse<GetPrfsPollByPollIdResponse>
//     : T extends "submit_prfs_poll_response"
//     ? PrfsApiResponse<SubmitPrfsPollResponseResponse>
//     : T extends "get_prfs_poll_result_by_poll_id"
//     ? PrfsApiResponse<GetPrfsPollResultByPollIdResponse>
//     : T extends "import_prfs_atsts_to_prfs_set"
//     ? PrfsApiResponse<GetPrfsPollResultByPollIdResponse>
//     : T extends "import_prfs_set_elements"
//     ? PrfsApiResponse<ImportPrfsSetElementsResponse>
//     : T extends "get_prfs_set_elements"
//     ? PrfsApiResponse<GetPrfsSetElementsResponse>
//     : T extends "get_prfs_set_element"
//     ? PrfsApiResponse<GetPrfsSetElementResponse>
//     : T extends "create_tree_of_prfs_set"
//     ? PrfsApiResponse<CreateTreeOfPrfsSetResponse>
//     : T extends "get_least_recent_prfs_index"
//     ? PrfsApiResponse<GetLeastRecentPrfsIndexResponse>
//     : T extends "get_prfs_indices"
//     ? PrfsApiResponse<GetPrfsIndicesResponse>
//     : T extends "add_prfs_index"
//     ? PrfsApiResponse<AddPrfsIndexResponse>
//     : any;

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
    throw new Error("prfs api endpoint not defined");
  }
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function prfsApi3(req: PrfsApiRequest) {
  // return (await api<T>(
  //   {
  //     path: name,
  //     req,
  //   },
  //   endpoint,
  // )) as Resp<T>;
}

export { prfs_api_error_codes, type PrfsApiResponse };
