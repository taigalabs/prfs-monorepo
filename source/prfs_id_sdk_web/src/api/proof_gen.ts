import { CommitmentQuery } from "../queries/commitment";
import { CreateProofQuery } from "../queries/create_proof";

export function makeProofGenSearchParams(args: ProofGenArgs): string {
  const { nonce, appId, queries, publicKey } = args;
  const q = encodeURIComponent(JSON.stringify(queries));
  const queryString = `?public_key=${publicKey}&queries=${q}&app_id=${appId}&nonce=${nonce}`;
  return queryString;
}

export function parseProofGenSearchParams(searchParams: URLSearchParams): ProofGenArgs {
  const publicKey = searchParams.get("public_key");
  const appId = searchParams.get("app_id");
  const nonce = searchParams.get("nonce");
  const queries = searchParams.get("queries");

  if (!appId) {
    throw new Error("app id missing");
  }

  if (!publicKey) {
    throw new Error("publicKey missing");
  }

  if (!queries) {
    throw new Error("query missing");
  }

  if (!nonce) {
    throw new Error("nonce missing");
  }

  const q = decodeURIComponent(queries);
  const _q: ProofGenQuery[] = JSON.parse(q);

  const args: ProofGenArgs = {
    appId,
    nonce: Number(nonce),
    publicKey,
    queries: _q,
  };

  return args;
}

export interface ProofGenArgs {
  nonce: number;
  appId: string;
  queries: ProofGenQuery[];
  publicKey: string;
}

export type ProofGenQuery = CommitmentQuery | CreateProofQuery;
