import { QueryType } from "./query";

export interface CreateProofQuery {
  name: string;
  proofTypeId: string;
  queryType: QueryType.CREATE_PROOF;
  presetVals?: QueryPresetVals;
  registry?: boolean;
  proofAction?: string;
}

export type QueryPresetVals = Record<string, any>;
