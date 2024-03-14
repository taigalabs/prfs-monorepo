// import { PrfsIdentitySignUpRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignUpRequest";
// import { PrfsIdentitySignUpResponse } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignUpResponse";
// import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
// import { PrfsIdentitySignInResponse } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInResponse";

// import { api } from "../utils";
// import { ApiResponse } from "../types";

// type RequestName = "sign_up_prfs_identity" | "sign_in_prfs_identity";

// type Req<T extends RequestName> = //
//   T extends "sign_up_prfs_identity"
//     ? PrfsIdentitySignUpRequest
//     : T extends "sign_in_prfs_identity"
//     ? PrfsIdentitySignInRequest
//     : never;

// type Resp<T> = //
//   T extends "sign_up_prfs_identity"
//     ? ApiResponse<PrfsIdentitySignUpResponse>
//     : T extends "sign_in_prfs_identity"
//     ? ApiResponse<PrfsIdentitySignInResponse>
//     : any;

// let endpoint: string;
// if (typeof process !== "undefined") {
//   if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
//     throw new Error("id api endpoint not defined");
//   }
//   endpoint = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/id_api/v0`;
// } else {
//   throw new Error("process is undefined");
// }

// export async function idApi<T extends RequestName>(name: T, req: Req<T>): Promise<Resp<T>> {
//   return (await api(
//     {
//       path: name,
//       req,
//     },
//     endpoint,
//   )) as Resp<T>;
// }

import { PrfsApiRequest } from "@taigalabs/prfs-entities/bindings/PrfsApiRequest";
import { PrfsApiResponse } from "@taigalabs/prfs-entities/bindings/PrfsApiResponse";

import { api } from "../utils";
import { ApiResponse } from "../types";

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
    throw new Error("prfs api endpoint not defined");
  }
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function prfsApi3<
  T extends { type: PrfsApiRequest["type"] },
  R extends { type: T["type"] } & PrfsApiResponse,
>(req: T): Promise<ApiResponse<R>> {
  return api<R>(
    {
      path: req.type,
      req,
    },
    endpoint,
  );
}
