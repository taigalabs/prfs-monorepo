import { SignUpRequest } from "@taigalabs/prfs-entities/bindings/SignUpRequest";
import { SignUpResponse } from "@taigalabs/prfs-entities/bindings/SignUpResponse";
import { SignInRequest } from "@taigalabs/prfs-entities/bindings/SignInRequest";
import { SignInResponse } from "@taigalabs/prfs-entities/bindings/SignInResponse";
import { GetPrfsCircuitDriversRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitDriversRequest";
import { GetPrfsCircuitDriversResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitDriversResponse";
import { GetPrfsCircuitDriverByDriverIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitDriverByDriverIdRequest";
import { GetPrfsCircuitDriverByDriverIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitDriverByDriverIdResponse";
import { GetPrfsCircuitTypesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitTypesRequest";
import { GetPrfsCircuitTypesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitTypesResponse";
import { GetPrfsCircuitTypeByCircuitTypeRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitTypeByCircuitTypeRequest";
import { GetPrfsCircuitTypeByCircuitTypeResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitTypeByCircuitTypeResponse";
import { GetPrfsCircuitsRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitsRequest";
import { GetPrfsCircuitsResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitsResponse";
import { GetPrfsCircuitByCircuitIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitByCircuitIdRequest";
import { GetPrfsCircuitByCircuitIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitByCircuitIdResponse";
import { GetPrfsProofInstanceByShortIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByShortIdResponse";
import { GetPrfsProofInstanceByShortIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByShortIdRequest";
import { GetPrfsProofInstancesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstancesResponse";
import { GetPrfsProofInstancesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstancesRequest";
import { GetPrfsProofInstanceByInstanceIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByInstanceIdRequest";
import { GetPrfsProofInstanceByInstanceIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByInstanceIdResponse";
import { CreatePrfsProofInstanceRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofInstanceRequest";
import { CreatePrfsProofInstanceResponse } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofInstanceResponse";
import { GetPrfsProofTypesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypesRequest";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import { GetPrfsProofTypeByProofTypeIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdResponse";
import { GetPrfsProofTypesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypesResponse";
import { CreatePrfsProofTypeRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofTypeRequest";
import { CreatePrfsProofTypeResponse } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofTypeResponse";
import { GetPrfsSetsRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetsRequest";
import { GetPrfsSetsBySetTypeRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetsBySetTypeRequest";
import { GetPrfsSetsResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsSetsResponse";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";
import { GetPrfsSetBySetIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdResponse";
import { CreatePrfsSetRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsSetRequest";
import { CreatePrfsSetResponse } from "@taigalabs/prfs-entities/bindings/CreatePrfsSetResponse";
import { CreatePrfsDynamicSetElementRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsDynamicSetElementRequest";
import { CreatePrfsDynamicSetElementResponse } from "@taigalabs/prfs-entities/bindings/CreatePrfsDynamicSetElementResponse";
import { GetPrfsTreeLeafNodesBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafNodesBySetIdRequest";
import { GetPrfsTreeLeafIndicesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafIndicesRequest";
import { GetPrfsTreeNodesByPosRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesByPosRequest";
import { GetPrfsTreeNodesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesResponse";
import { UpdatePrfsTreeNodeRequest } from "@taigalabs/prfs-entities/bindings/UpdatePrfsTreeNodeRequest";
import { UpdatePrfsTreeNodeResponse } from "@taigalabs/prfs-entities/bindings/UpdatePrfsTreeNodeResponse";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

type RequestName =
  | "sign_up_prfs_account"
  | "sign_in_prfs_account"
  | "get_prfs_circuit_drivers"
  | "get_prfs_circuit_driver_by_driver_id"
  | "get_prfs_circuit_types"
  | "get_prfs_circuit_type_by_circuit_type"
  | "get_prfs_circuits"
  | "get_prfs_circuit_by_circuit_id"
  | "create_prfs_proof_instance"
  | "get_prfs_proof_instances"
  | "get_prfs_proof_instance_by_instance_id"
  | "get_prfs_proof_instance_by_short_id"
  | "create_prfs_proof_type"
  | "get_prfs_proof_types"
  | "get_prfs_proof_type_by_proof_type_id"
  | "get_prfs_sets"
  | "create_prfs_set"
  | "get_prfs_sets_by_set_type"
  | "get_prfs_set_by_set_id"
  | "create_prfs_dynamic_set_element"
  | "get_prfs_tree_nodes_by_pos"
  | "get_prfs_tree_leaf_nodes_by_set_id"
  | "get_prfs_tree_leaf_indices"
  | "update_prfs_tree_node";

type Req<T extends RequestName> = //
  T extends "sign_up_prfs_account"
    ? SignUpRequest
    : T extends "sign_in_prfs_account"
    ? SignInRequest
    : T extends "get_prfs_circuit_drivers"
    ? GetPrfsCircuitDriversRequest
    : T extends "get_prfs_circuit_driver_by_driver_id"
    ? GetPrfsCircuitDriverByDriverIdRequest
    : T extends "get_prfs_circuit_types"
    ? GetPrfsCircuitTypesRequest
    : T extends "get_prfs_circuit_type_by_circuit_type"
    ? GetPrfsCircuitTypeByCircuitTypeRequest
    : T extends "get_prfs_circuits"
    ? GetPrfsCircuitsRequest
    : T extends "get_prfs_circuit_by_circuit_id"
    ? GetPrfsCircuitByCircuitIdRequest
    : T extends "create_prfs_proof_instance"
    ? CreatePrfsProofInstanceRequest
    : T extends "get_prfs_proof_instances"
    ? GetPrfsProofInstancesRequest
    : T extends "get_prfs_proof_instance_by_instance_id"
    ? GetPrfsProofInstanceByInstanceIdRequest
    : T extends "get_prfs_proof_instance_by_short_id"
    ? GetPrfsProofInstanceByShortIdRequest
    : T extends "create_prfs_proof_type"
    ? CreatePrfsProofTypeRequest
    : T extends "get_prfs_proof_types"
    ? GetPrfsProofTypesRequest
    : T extends "get_prfs_proof_type_by_proof_type_id"
    ? GetPrfsProofTypeByProofTypeIdRequest
    : T extends "get_prfs_sets"
    ? GetPrfsSetsRequest
    : T extends "create_prfs_set"
    ? CreatePrfsSetRequest
    : T extends "get_prfs_sets_by_set_type"
    ? GetPrfsSetsBySetTypeRequest
    : T extends "get_prfs_set_by_set_id"
    ? GetPrfsSetBySetIdRequest
    : T extends "create_prfs_dynamic_set_element"
    ? CreatePrfsDynamicSetElementRequest
    : T extends "get_prfs_tree_nodes_by_pos"
    ? GetPrfsTreeNodesByPosRequest
    : T extends "get_prfs_tree_leaf_nodes_by_set_id"
    ? GetPrfsTreeLeafNodesBySetIdRequest
    : T extends "get_prfs_tree_leaf_indices"
    ? GetPrfsTreeLeafIndicesRequest
    : T extends "update_prfs_tree_node"
    ? UpdatePrfsTreeNodeRequest
    : never;

type Resp<T> = //
  T extends "sign_up_prfs_account"
    ? PrfsApiResponse<SignUpResponse>
    : T extends "sign_in_prfs_account"
    ? PrfsApiResponse<SignInResponse>
    : T extends "get_prfs_circuit_drivers"
    ? PrfsApiResponse<GetPrfsCircuitDriversResponse>
    : T extends "get_prfs_circuit_driver_by_driver_id"
    ? PrfsApiResponse<GetPrfsCircuitDriverByDriverIdResponse>
    : T extends "get_prfs_circuit_types"
    ? PrfsApiResponse<GetPrfsCircuitTypesResponse>
    : T extends "get_prfs_circuit_type_by_circuit_type"
    ? PrfsApiResponse<GetPrfsCircuitTypeByCircuitTypeResponse>
    : T extends "get_prfs_circuits"
    ? PrfsApiResponse<GetPrfsCircuitsResponse>
    : T extends "get_prfs_circuit_by_circuit_id"
    ? PrfsApiResponse<GetPrfsCircuitByCircuitIdResponse>
    : T extends "create_prfs_proof_instance"
    ? PrfsApiResponse<CreatePrfsProofInstanceResponse>
    : T extends "get_prfs_proof_instances"
    ? PrfsApiResponse<GetPrfsProofInstancesResponse>
    : T extends "get_prfs_proof_instance_by_instance_id"
    ? PrfsApiResponse<GetPrfsProofInstanceByInstanceIdResponse>
    : T extends "get_prfs_proof_instance_by_short_id"
    ? PrfsApiResponse<GetPrfsProofInstanceByShortIdResponse>
    : T extends "create_prfs_proof_type"
    ? PrfsApiResponse<CreatePrfsProofTypeResponse>
    : T extends "get_prfs_proof_types"
    ? PrfsApiResponse<GetPrfsProofTypesResponse>
    : T extends "get_prfs_proof_type_by_proof_type_id"
    ? PrfsApiResponse<GetPrfsProofTypeByProofTypeIdResponse>
    : T extends "get_prfs_sets"
    ? PrfsApiResponse<GetPrfsSetsResponse>
    : T extends "create_prfs_set"
    ? PrfsApiResponse<CreatePrfsSetResponse>
    : T extends "get_prfs_sets_by_set_type"
    ? PrfsApiResponse<GetPrfsSetsResponse>
    : T extends "get_prfs_set_by_set_id"
    ? PrfsApiResponse<GetPrfsSetBySetIdResponse>
    : T extends "create_prfs_dynamic_set_element"
    ? PrfsApiResponse<CreatePrfsDynamicSetElementResponse>
    : T extends "get_prfs_tree_nodes_by_pos"
    ? PrfsApiResponse<GetPrfsTreeNodesResponse>
    : T extends "get_prfs_tree_leaf_nodes_by_set_id"
    ? PrfsApiResponse<GetPrfsTreeNodesResponse>
    : T extends "get_prfs_tree_leaf_indices"
    ? PrfsApiResponse<GetPrfsTreeNodesResponse>
    : T extends "update_prfs_tree_node"
    ? PrfsApiResponse<UpdatePrfsTreeNodeResponse>
    : any;

export async function prfsApi2<T extends RequestName>(name: T, req: Req<T>): Promise<Resp<T>> {
  return (await api({
    path: name,
    req,
  })) as Resp<T>;
}
