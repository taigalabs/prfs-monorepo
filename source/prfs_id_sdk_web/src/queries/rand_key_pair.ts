import { QueryType } from "./query";

export interface RandKeyPairQuery {
  name: string;
  preImage: string;
  type: RandKeyPairType;
  queryType: QueryType.RAND_KEY_PAIR;
}

export enum RandKeyPairType {
  EC_SECP256K1 = "EC_SECP256K1",
}
