import { QueryType } from "./query";

export interface AppSignInQuery {
  name: string;
  type: AppSignInType;
  queryType: QueryType.APP_SIGN_IN;
  appSignInData: AppSignInData[];
}

export enum AppSignInType {
  EC_SECP256K1 = "EC_SECP256K1",
}

export interface AppSignInResult {
  account_id: string;
  public_key: string;
}

export enum AppSignInData {
  ID_POSEIDON = "ID_POSEIDON",
}
