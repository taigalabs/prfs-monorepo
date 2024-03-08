import { QueryType } from "../query_type";

export interface RandKeyPairQuery {
  name: string;
  preImage: string;
  type: RandKeyPairType;
  queryType: QueryType.RAND_KEY_PAIR;
  skipAfterIfExists?: boolean;
}

export interface RandKeyPairReceipt {
  secretKey: string;
}

export enum RandKeyPairType {
  EC_SECP256K1 = "EC_SECP256K1",
}
