export const PROOF_GEN_PATH = "/proof_gen";

export function makeProofGenSearchParams(args: ProofGenArgs): string {
  const { nonce, appId, proofTypeId, publicKey } = args;
  const queryString = `?public_key=${publicKey}&proof_type_id=${proofTypeId}&app_id=${appId}&nonce=${nonce}`;
  return queryString;
}

export function parseProofGenSearchParams(searchParams: URLSearchParams): ProofGenArgs {
  const publicKey = searchParams.get("public_key");
  const appId = searchParams.get("app_id");
  const proofTypeId = searchParams.get("proof_type_id");
  const nonce = searchParams.get("nonce");

  if (!appId) {
    throw new Error("app id missing");
  }

  if (!publicKey) {
    throw new Error("publicKey missing");
  }

  if (!proofTypeId) {
    throw new Error("proofType missing");
  }

  if (!nonce) {
    throw new Error("nonce missing");
  }

  const args: ProofGenArgs = {
    appId,
    nonce: Number(nonce),
    publicKey,
    proofTypeId,
  };

  return args;
}

export interface ProofGenArgs {
  nonce: number;
  appId: string;
  proofTypeId: string;
  publicKey: string;
}
