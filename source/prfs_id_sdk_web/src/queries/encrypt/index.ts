import { QueryType } from "../query_type";

export interface EncryptQuery {
  name: string;
  msg: string;
  type: EncryptType;
  queryType: QueryType.ENCRYPT;
}

export enum EncryptType {
  EC_SECP256K1 = "EC_SECP256K1",
}
