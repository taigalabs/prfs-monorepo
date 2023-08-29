import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";
import { SignUpRequest } from "@taigalabs/prfs-entities/bindings/SignUpRequest";
import { SignUpResponse } from "@taigalabs/prfs-entities/bindings/SignUpResponse";
import { SignInRequest } from "@taigalabs/prfs-entities/bindings/SignInRequest";
import { SignInResponse } from "@taigalabs/prfs-entities/bindings/SignInResponse";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

export async function signUpPrfsAccount(req: SignUpRequest) {
  return (await api({
    path: `sign_up_prfs_account`,
    req,
  })) as PrfsApiResponse<SignUpResponse>;
}

export async function signInPrfsAccount(req: SignInRequest) {
  return (await api({
    path: `sign_in_prfs_account`,
    req,
  })) as PrfsApiResponse<SignInResponse>;
}
