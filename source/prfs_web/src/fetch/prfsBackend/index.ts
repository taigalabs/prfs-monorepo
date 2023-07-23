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

  // try {
  //   let res = await fetch(`${PRFS_API_SERVER_ENDPOINT}/prfs_account/sign_up`, {
  //     method: "POST",
  //     mode: "cors",
  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //     body: JSON.stringify(signUpReq),
  //   });

  //   let resp: SignUpResponse = await res.json();
  //   return resp;
  // } catch (err) {
  //   console.log("error fetching", err);
  // }
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

  // try {
  //   let res = await fetch(`${PRFS_API_SERVER_ENDPOINT}/prfs_account/sign_in`, {
  //     method: "POST",
  //     mode: "cors",
  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //     body: JSON.stringify(signInReq),
  //   });

  //   let resp: SignInResponse = await res.json();
  //   return resp;
  // } catch (err) {
  //   console.log("error fetching", err);
  // }
}

export interface GetCircuitsRequest {
  sig: string;
}

export type GetCircuitsResponse = PrfsApiResponse<{
  sig: string;
  id: string;
}>;

// async function getCircuits(sig: string) {
//   let signInReq: SignInRequest = {
//     sig,
//   };

//   try {
//     let res = await fetch(`${PRFS_API_SERVER_ENDPOINT}/prfs_account/sign_in`, {
//       method: "POST",
//       mode: "cors",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify(signInReq),
//     });

//     let resp: SignInResponse = await res.json();
//     return resp;
//   } catch (err) {
//     console.log("error fetching", err);
//   }
// }

export default {
  signInPrfsAccount,
  signUpPrfsAccount,
  // getCircuits,
};
