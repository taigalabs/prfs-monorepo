import { QueryType } from "./query";

// export interface EncodeArgs {
//   appId: string;
//   nonce: number;
//   publicKey: string;
//   queries: EncodeQuery[];
// }

export interface EncryptQuery {
  name: string;
  msg: string;
  type: EncryptType;
  queryType: QueryType.ENCRYPT;
}

export enum EncryptType {
  EC_SECP256K1 = "EC_SECP256K1",
}

// export const WALLET_CACHE_KEY = "wallet_cache_key";
// export const WALLET_CM_STEM = "WALLET";

// export function makeCmCacheKeyQueries(
//   _name: string,
//   count: number,
//   stem: string,
// ): CommitmentQuery[] {
//   const queries = [];

//   for (let idx = 0; idx < count; idx += 1) {
//     const preImage = `${stem}_${idx}`;
//     const name = `${_name}_${idx}`;

//     queries.push({
//       name,
//       preImage,
//       type: CommitmentType.SIG_POSEIDON_1,
//       queryType: QueryType.COMMITMENT as QueryType.COMMITMENT,
//     });
//   }

//   return queries;
// }
