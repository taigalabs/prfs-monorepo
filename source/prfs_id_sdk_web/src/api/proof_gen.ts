import { createQueryString } from "../search_params";
import { TutorialArgs } from "../tutorial";
import { CommitmentQuery } from "../queries/commitment";
import { CreateProofQuery } from "../queries/create_proof";
import { EncryptQuery } from "../queries/encrypt";

export function makeProofGenSearchParams(args: ProofGenArgs): string {
  const s = "?" + createQueryString(args);
  return s;
}

export function parseProofGenSearchParams(searchParams: URLSearchParams): ProofGenArgs {
  const public_key = searchParams.get("public_key");
  const app_id = searchParams.get("app_id");
  const nonce = searchParams.get("nonce");
  const queries = searchParams.get("queries");
  const session_key = searchParams.get("session_key");
  const tutorial = searchParams.get("tutorial");

  if (!app_id) {
    throw new Error("app id missing");
  }

  if (!public_key) {
    throw new Error("public key missing");
  }

  if (!queries) {
    throw new Error("query missing");
  }

  if (!nonce) {
    throw new Error("nonce missing");
  }

  if (!session_key) {
    throw new Error("session_key missing");
  }

  const args: ProofGenArgs = {
    app_id,
    nonce: Number(nonce),
    public_key,
    session_key,
    queries: JSON.parse(decodeURIComponent(queries)),
  };

  if (tutorial) {
    args.tutorial = JSON.parse(decodeURIComponent(tutorial));
  }
  return args;
}

export interface ProofGenArgs {
  nonce: number;
  app_id: string;
  queries: ProofGenQuery[];
  public_key: string;
  session_key: string;
  tutorial?: TutorialArgs;
}

export type ProofGenQuery = CommitmentQuery | CreateProofQuery | EncryptQuery;
