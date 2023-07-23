"use client";

import { api } from "./api";
import { PrfsApiResponse } from "./types";

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

export interface GetCircuitsRequest {}

export type GetCircuitsResponse = PrfsApiResponse<{}>;

async function getCircuits() {
  let req: GetCircuitsRequest = {};

  try {
    let resp: GetCircuitsResponse = await api({
      path: `get_circuits`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
  }
}

export default {
  signInPrfsAccount,
  signUpPrfsAccount,
  getCircuits,
};
