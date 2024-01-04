import { QueryType } from "./query";

export interface CreateProofQuery {
  name: string;
  proofTypeId: string;
  queryType: QueryType.CREATE_PROOF;
}
