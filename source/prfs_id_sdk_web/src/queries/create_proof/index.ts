import { QueryType } from "../query_type";

export interface CreateProofQuery {
  name: string;
  proofTypeId: string;
  queryType: QueryType.CREATE_PROOF;
  presetVals?: QueryPresetVals;
  usePrfsRegistry?: boolean;
  proofAction: string;
}

export type QueryPresetVals = Record<string, any>;
