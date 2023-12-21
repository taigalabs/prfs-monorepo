import { decrypt, PrivateKey } from "eciesjs";

const API_PATH = {
  commitment: "commitment",
};

export function getCommitment({ prfsIdEndpoint, appId, preImage, sk, pkHex }: GetCommitmentArgs) {
  const nonce = Math.random() * 1000000;
  // const queryString = `?public_key=${pkHex}&redirect_uri=${redirectUri}&sign_in_data=${signInData}&app_id=${appId}&nonce=${nonce}`;
  // const prfsIdEndpoint = `${prfsIdEndpoint}${paths.id__signin}${queryString}`;
  // setPrfsIdSignInEndpoint(prfsIdEndpoint);
}

export interface GetCommitmentArgs {
  prfsIdEndpoint: string;
  appId: string;
  preImage: string;
  sk: PrivateKey;
  pkHex: string;
}
