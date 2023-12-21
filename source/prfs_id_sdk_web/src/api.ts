import { decrypt, PrivateKey } from "eciesjs";

const API_PATH = {
  commitment: "/commitment",
};

export function getCommitment({ prfsIdEndpoint, appId, preImage, sk, pkHex }: GetCommitmentArgs) {
  const nonce = Math.random() * 1000000;
  const queryString = `?public_key=${pkHex}&app_id=${appId}&nonce=${nonce}`;
  const endpoint = `${prfsIdEndpoint}${API_PATH.commitment}${queryString}`;
  // setPrfsIdSignInEndpoint(prfsIdEndpoint);
  if (endpoint) {
    window.open(endpoint, "_blank", "toolbar=0,location=0,menubar=0");
  }
}

export interface GetCommitmentArgs {
  prfsIdEndpoint: string;
  appId: string;
  preImage: string;
  sk: PrivateKey;
  pkHex: string;
}
