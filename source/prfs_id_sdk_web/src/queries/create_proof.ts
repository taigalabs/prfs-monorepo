import { QueryType } from "./query";

export interface CreateProofQuery {
  name: string;
  proofTypeId: string;
  queryType: QueryType.CREATE_PROOF;
  presetVals?: QueryPresetVals;
}

export type QueryPresetVals = Record<string, any>;
