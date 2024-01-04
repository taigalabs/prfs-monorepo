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
