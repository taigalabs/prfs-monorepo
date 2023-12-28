export enum AppSignInData {
  ID_POSEIDON = "ID_POSEIDON",
}

export function makeAppSignInSearchParams(args: AppSignInArgs): string {
  const { nonce, appId, signInData, publicKey, prfsAppSignInEndpoint } = args;

  // const nonce = Math.random() * 1000000;
  // const appId = "prfs_proof";
  const _signInData = encodeURIComponent(signInData.join(","));
  const queryString = `?public_key=${publicKey}&sign_in_data=${_signInData}&app_id=${appId}&nonce=${nonce}`;
  return `${prfsAppSignInEndpoint}${queryString}`;

  // setPrfsIdSignInEndpoint(prfsIdEndpoint);
}

export function parseAppSignInSearchParams(searchParams: any) {}

export interface AppSignInArgs {
  nonce: number;
  appId: string;
  signInData: AppSignInData[];
  publicKey: string;
  prfsAppSignInEndpoint: string;
}
