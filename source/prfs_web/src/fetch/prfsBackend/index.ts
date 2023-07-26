"use client";

import { PrfsCircuit } from "@/models";
import { api } from "./utils";
import { PrfsApiResponse } from "./types";
import { GetSetsArgs, GetSetsResponse, getSets, getSetElements } from "./prfs_sets";

export type { GetSetsArgs, GetSetsResponse };

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

export interface GetNativeCircuitsRequest {
  page: number;
  circuit_id?: string;
}

export type GetNativeCircuitsResponse = PrfsApiResponse<{
  page: number;
  prfs_circuits: PrfsCircuit[];
}>;

async function getPrfsNativeCircuits({ page, circuit_id }: GetNativeCircuitsRequest) {
  let req: GetNativeCircuitsRequest = {
    page,
    circuit_id,
  };

  try {
    let resp: GetNativeCircuitsResponse = await api({
      path: `get_prfs_native_circuits`,
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
  getPrfsNativeCircuits,
  getSets,
  getSetElements,
};
