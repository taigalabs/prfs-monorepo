import { decrypt, PrivateKey } from "eciesjs";

import { API_PATH } from "../api_path";

export function getCommitment({
  prfsIdEndpoint,
  appId,
  preImage,
  sk,
  pkHex,
  cms,
}: GetCommitmentArgs) {
  const nonce = Math.random() * 1000000;
  const cmsStr = encodeURIComponent(JSON.stringify(cms));
  const queryString = `?public_key=${pkHex}&app_id=${appId}&nonce=${nonce}&cms=${cmsStr}`;
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
  cms: CommitmentData;
}

export interface CommitmentMeta {
  val: string;
  type: CommitmentType;
}

export enum CommitmentType {
  SIG_POSEIDON_1 = "SIG_POSEIDON_1",
}

export type CommitmentData = Record<string, CommitmentMeta>;
