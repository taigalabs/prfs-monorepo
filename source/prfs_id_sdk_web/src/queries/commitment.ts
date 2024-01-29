import { QueryType } from "./query";

export interface CommitmentArgs {
  appId: string;
  nonce: number;
  publicKey: string;
  cms: CommitmentQuery[];
}

export interface CommitmentQuery {
  name: string;
  preImage: string;
  type: CommitmentType;
  queryType: QueryType.COMMITMENT;
}

export enum CommitmentType {
  SIG_POSEIDON_1 = "SIG_POSEIDON_1",
}

export function makeCmCacheKeyQueries(name: string, count: number, stem: string) {
  const queries = [];

  for (let idx = 0; idx < count; idx += 1) {
    const preImage = `${stem}_${idx}`;

    queries.push({
      name,
      preImage,
      type: CommitmentType.SIG_POSEIDON_1,
      queryType: QueryType.COMMITMENT,
    });
  }

  return queries;
}
