import { createQueryString } from "../search_params";

export function makeAppSignInSearchParams(args: AppSignInArgs): string {
  const s = "?" + createQueryString(args);
  return s;
}

export function parseAppSignInSearchParams(searchParams: URLSearchParams): AppSignInArgs {
  const public_key = searchParams.get("public_key");
  const app_id = searchParams.get("app_id");
  const sign_in_data = searchParams.get("sign_in_data");
  const nonce = searchParams.get("nonce");
  const session_key = searchParams.get("session_key");

  if (!app_id) {
    throw new Error("app id missing");
  }

  if (!public_key) {
    throw new Error("publicKey missing");
  }

  if (!sign_in_data) {
    throw new Error("signInData missing");
  }

  if (!nonce) {
    throw new Error("nonce missing");
  }

  if (!session_key) {
    throw new Error("session_key missing");
  }

  const args: AppSignInArgs = {
    app_id,
    nonce: Number(nonce),
    public_key,
    session_key,
    sign_in_data: JSON.parse(decodeURIComponent(sign_in_data)),
  };
  return args;
}

export enum AppSignInData {
  ID_POSEIDON = "ID_POSEIDON",
}

export interface AppSignInArgs {
  nonce: number;
  app_id: string;
  sign_in_data: AppSignInData[];
  public_key: string;
  session_key: string;
}

export interface SignInSuccessPayload {
  account_id: string;
  public_key: string;
}
