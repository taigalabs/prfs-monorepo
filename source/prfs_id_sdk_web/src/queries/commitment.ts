import { QueryType } from "./query";

export interface CommitmentQuery {
  name: string;
  preImage: string;
  type: CommitmentType;
  queryType: QueryType.COMMITMENT;
}

export enum CommitmentType {
  SIG_POSEIDON_1 = "SIG_POSEIDON_1",
}

export const WALLET_CACHE_KEY = "wallet_cache_key";
export const WALLET_CM_STEM = "WALLET";

export function makeCmCacheKeyQueries(
  _name: string,
  count: number,
  stem: string,
): CommitmentQuery[] {
  const queries = [];

  for (let idx = 0; idx < count; idx += 1) {
    const preImage = `${stem}_${idx}`;
    const name = `${_name}_${idx}`;

    queries.push({
      name,
      preImage,
      type: CommitmentType.SIG_POSEIDON_1,
      queryType: QueryType.COMMITMENT as QueryType.COMMITMENT,
    });
  }

  return queries;
}
