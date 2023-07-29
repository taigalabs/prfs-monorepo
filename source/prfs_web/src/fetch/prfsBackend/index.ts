"use client";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";
import { GetSetsArgs, GetSetsResponse, getSets, getSetElements } from "./prfs_sets";
import {
  GetNativeCircuitsResponse,
  GetNativeCircuitsRequest,
  getPrfsNativeCircuits,
} from "./prfs_circuits";

export type { GetSetsArgs, GetSetsResponse, GetNativeCircuitsResponse, GetNativeCircuitsRequest };

export interface SignUpRequest {
  sig: string;
}

export type SignUpResponse = PrfsApiResponse<{
  sig: string;
  id: string;
}>;

async function signUpPrfsAccount(sig: string) {
  let signUpReq: SignInRequest = {
    sig,
  };

  try {
    let resp: SignUpResponse = await api({
      path: `sign_up_prfs_account`,
      req: signUpReq,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
  }
}

export interface SignInRequest {
  sig: string;
}

export type SignInResponse = PrfsApiResponse<{
  sig: string;
  id: string;
}>;

async function signInPrfsAccount(sig: string) {
  let signInReq: SignInRequest = {
    sig,
  };

  try {
    let resp: SignInResponse = await api({
      path: `sign_in_prfs_account`,
      req: signInReq,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
  }
}

export default {
  signInPrfsAccount,
  signUpPrfsAccount,
  getSets,
  getSetElements,
  getPrfsNativeCircuits,
};
