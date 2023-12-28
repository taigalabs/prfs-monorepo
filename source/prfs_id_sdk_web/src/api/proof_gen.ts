export const PROOF_GEN_PATH = "/proof_gen";

export function makeProofGenSearchParams(args: ProofGenArgs): string {
  const { nonce, appId, proofType, publicKey } = args;
  const queryString = `?public_key=${publicKey}&proof_type=${proofType}&app_id=${appId}&nonce=${nonce}`;
  return queryString;
}

export function parseProofGenSearchParams(searchParams: URLSearchParams): ProofGenArgs {
  const publicKey = searchParams.get("public_key");
  const appId = searchParams.get("app_id");
  const proofType = searchParams.get("proof_type");
  const nonce = searchParams.get("nonce");

  if (!appId) {
    throw new Error("app id missing");
  }

  if (!publicKey) {
    throw new Error("publicKey missing");
  }

  if (!proofType) {
    throw new Error("proofType missing");
  }

  if (!nonce) {
    throw new Error("nonce missing");
  }

  const args: ProofGenArgs = {
    appId,
    nonce: Number(nonce),
    publicKey,
    proofType,
    // signInData: signInData.split(",") as AppSignInData[],
  };

  return args;
}

export enum AppSignInData {
  ID_POSEIDON = "ID_POSEIDON",
}

export interface ProofGenArgs {
  nonce: number;
  appId: string;
  proofType: string;
  publicKey: string;
}
