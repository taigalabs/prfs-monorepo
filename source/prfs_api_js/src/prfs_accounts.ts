import { api } from "./utils";
import { PrfsApiResponse } from "./types";
import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";

export interface SignUpRequest {
  sig: string;
  avatarColor: string;
}

export type SignUpResponse = PrfsApiResponse<{
  sig: string;
  id: string;
}>;

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

export interface SignInRequest {
  sig: string;
}

export type SignInResponse = PrfsApiResponse<{
  prfs_account: PrfsAccount;
}>;

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
