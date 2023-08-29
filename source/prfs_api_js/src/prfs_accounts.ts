import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";
import { SignUpRequest } from "@taigalabs/prfs-entities/bindings/SignUpRequest";
import { SignUpResponse } from "@taigalabs/prfs-entities/bindings/SignUpResponse";
import { SignInRequest } from "@taigalabs/prfs-entities/bindings/SignInRequest";
import { SignInResponse } from "@taigalabs/prfs-entities/bindings/SignInResponse";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

// export interface SignUpRequest {
//   sig: string;
//   avatarColor: string;
// }

// export type SignUpResponse = PrfsApiResponse<{
//   sig: string;
//   id: string;
// }>;

export async function signUpPrfsAccount(req: SignUpRequest) {
  try {
    let resp: SignUpResponse = await api({
      path: `sign_up_prfs_account`,
      req,
    });

    return resp;
  } catch (err) {
    console.log("error fetching", err);
    throw err;
  }
}

// export interface SignInRequest {
//   sig: string;
// }

// export type SignInResponse = PrfsApiResponse<{
//   prfs_account: PrfsAccount;
// }>;

export async function signInPrfsAccount(req: SignInRequest) {
  try {
    let resp: SignInResponse = await api({
      path: `sign_in_prfs_account`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
    throw err;
  }
}
