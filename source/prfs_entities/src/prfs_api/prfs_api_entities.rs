use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use ts_rs::TS;

use super::{
    syn::PrfsCircuitSyn1, AddPrfsIndexRequest, CreatePrfsDynamicSetElementRequest,
    CreatePrfsPollRequest, CreatePrfsProofInstanceRequest, CreatePrfsProofTypeRequest,
    CreatePrfsSetRequest, CreateTreeOfPrfsSetRequest, GetLeastRecentPrfsIndexRequest,
    GetPrfsCircuitByCircuitIdRequest, GetPrfsCircuitDriverByDriverIdRequest,
    GetPrfsCircuitDriversRequest, GetPrfsCircuitTypeByCircuitTypeIdRequest,
    GetPrfsCircuitTypesRequest, GetPrfsCircuitsRequest, GetPrfsIndicesRequest,
    GetPrfsPollByPollIdRequest, GetPrfsPollsRequest, GetPrfsProofInstanceByInstanceIdRequest,
    GetPrfsProofInstanceByShortIdRequest, GetPrfsProofInstancesRequest,
    GetPrfsProofTypeByProofTypeIdRequest, GetPrfsProofTypesRequest, GetPrfsSetBySetIdRequest,
    GetPrfsSetElementsRequest, GetPrfsSetsBySetTypeRequest, GetPrfsSetsRequest,
    GetPrfsTreeLeafIndicesRequest, GetPrfsTreeLeafNodesBySetIdRequest,
    GetPrfsTreeNodesByPosRequest, ImportPrfsSetElementsRequest, PrfsIdentitySignUpRequest,
    SubmitPrfsPollResponseRequest, UpdatePrfsTreeNodeRequest,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type", rename_all = "snake_case")]
#[ts(export)]
pub enum PrfsApiRequest {
    GetPrfsCircuitsRequest(GetPrfsCircuitsRequest),
    GetPrfsCircuitByCircuitIdRequest(GetPrfsCircuitByCircuitIdRequest),
    PrfsIdentitySignUpRequest(PrfsIdentitySignUpRequest),
    GetPrfsCircuitDriversRequest(GetPrfsCircuitDriversRequest),
    GetPrfsCircuitDriverByDriverIdRequest(GetPrfsCircuitDriverByDriverIdRequest),
    GetPrfsCircuitTypesRequest(GetPrfsCircuitTypesRequest),
    GetPrfsCircuitTypeByCircuitTypeIdRequest(GetPrfsCircuitTypeByCircuitTypeIdRequest),
    GetLeastRecentPrfsIndexRequest(GetLeastRecentPrfsIndexRequest),
    GetPrfsIndicesRequest(GetPrfsIndicesRequest),
    AddPrfsIndexRequest(AddPrfsIndexRequest),
    GetPrfsPollsRequest(GetPrfsPollsRequest),
    CreatePrfsPollRequest(CreatePrfsPollRequest),
    GetPrfsPollByPollIdRequest(GetPrfsPollByPollIdRequest),
    SubmitPrfsPollResponseRequest(SubmitPrfsPollResponseRequest),
    GetPrfsProofInstancesRequest(GetPrfsProofInstancesRequest),
    GetPrfsProofInstanceByInstanceIdRequest(GetPrfsProofInstanceByInstanceIdRequest),
    GetPrfsProofInstanceByShortIdRequest(GetPrfsProofInstanceByShortIdRequest),
    CreatePrfsProofInstanceRequest(CreatePrfsProofInstanceRequest),
    GetPrfsProofTypesRequest(GetPrfsProofTypesRequest),
    GetPrfsProofTypeByProofTypeIdRequest(GetPrfsProofTypeByProofTypeIdRequest),
    CreatePrfsProofTypeRequest(CreatePrfsProofTypeRequest),
    GetPrfsSetBySetIdRequest(GetPrfsSetBySetIdRequest),
    GetPrfsSetsRequest(GetPrfsSetsRequest),
    GetPrfsSetsBySetTypeRequest(GetPrfsSetsBySetTypeRequest),
    CreatePrfsSetRequest(CreatePrfsSetRequest),
    CreatePrfsDynamicSetElementRequest(CreatePrfsDynamicSetElementRequest),
    CreateTreeOfPrfsSetRequest(CreateTreeOfPrfsSetRequest),
    ImportPrfsSetElementsRequest(ImportPrfsSetElementsRequest),
    GetPrfsSetElementsRequest(GetPrfsSetElementsRequest),
    GetPrfsSetElementRequest(GetPrfsSetElementsRequest),
    GetPrfsTreeNodesByPosRequest(GetPrfsTreeNodesByPosRequest),
    GetPrfsTreeLeafNodesBySetIdRequest(GetPrfsTreeLeafNodesBySetIdRequest),
    GetPrfsTreeLeafIndicesRequest(GetPrfsTreeLeafIndicesRequest),
    UpdatePrfsTreeNodeRequest(UpdatePrfsTreeNodeRequest),
}
