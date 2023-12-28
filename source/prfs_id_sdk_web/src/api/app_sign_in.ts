export enum AppSignInData {
  ID_POSEIDON = "ID_POSEIDON",
}

export function makeAppSignInSearchParams(args: AppSignInArgs): string {
  const { nonce, appId, signInData, publicKey } = args;

  // const nonce = Math.random() * 1000000;
  // const appId = "prfs_proof";
  const _signInData = encodeURIComponent(signInData.join(","));
  const queryString = `?public_key=${publicKey}&sign_in_data=${_signInData}&app_id=${appId}&nonce=${nonce}`;
  return queryString;

  // setPrfsIdSignInEndpoint(prfsIdEndpoint);
}

export function parseAppSignInSearchParams(searchParams: URLSearchParams): AppSignInArgs {
  const publicKey = searchParams.get("public_key");
  const appId = searchParams.get("app_id");
  const signInData = searchParams.get("sign_in_data");
  const nonce = searchParams.get("nonce");

  if (!appId) {
    throw new Error("app id missing");
  }

  if (!publicKey) {
    throw new Error("publicKey missing");
  }

  if (!signInData) {
    throw new Error("signInData missing");
  }

  if (!nonce) {
    throw new Error("nonce missing");
  }

  const args: AppSignInArgs = {
    appId,
    nonce: Number(nonce),
    publicKey,
    signInData: signInData.split(",") as AppSignInData[],
  };

  return args;
}

export interface AppSignInArgs {
  nonce: number;
  appId: string;
  signInData: AppSignInData[];
  publicKey: string;
  // prfsAppSignInEndpoint: string;
}
