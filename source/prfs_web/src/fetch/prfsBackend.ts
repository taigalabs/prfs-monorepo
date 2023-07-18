"use client";

const PRFS_BACKEND_ENDPOINT = process.env.NEXT_PUBLIC_PRFS_BACKEND_ENDPOINT;

export interface SignUpRequest {
  sig: string;
}

export interface SignUpResponse {
  code: string;
  error?: any;
  result: string;
}

export async function signUpPrfsAccount(sig: string) {
  let signUpReq: SignInRequest = {
    sig,
  };

  try {
    let res = await fetch(`${PRFS_BACKEND_ENDPOINT}/prfs_account/sign_up`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(signUpReq),
    });

    let resp: SignUpResponse = await res.json();
    return resp;
  } catch (err) {
    console.log("error fetching", err);
  }
}

export interface SignInRequest {
  sig: string;
}

export interface SignInResponse {
  code: string;
  error?: any;
  payload: {
    sig: string;
    id: string;
  };
}

export async function signInPrfsAccount(sig: string) {
  let signInReq: SignInRequest = {
    sig,
  };

  try {
    let res = await fetch(`${PRFS_BACKEND_ENDPOINT}/prfs_account/sign_in`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(signInReq),
    });

    let resp: SignInResponse = await res.json();
    return resp;
  } catch (err) {
    console.log("error fetching", err);
  }
}
