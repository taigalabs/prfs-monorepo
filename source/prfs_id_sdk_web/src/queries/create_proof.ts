import { QueryType } from "./query";

export interface CreateProofQuery {
  name: string;
  proofTypeId: string;
  presetVals: Record<string, any>;
  queryType: QueryType.CREATE_PROOF;
}
