import { TutorialArgs } from "../tutorial";
import { createQueryString } from "../search_params";

export function makeVerifyProofSearchParams(args: VerifyProofArgs): string {
  const s = "?" + createQueryString(args);
  return s;
}

export function parseVerifyProofSearchParams(searchParams: URLSearchParams): VerifyProofArgs {
  const public_key = searchParams.get("public_key");
  const app_id = searchParams.get("app_id");
  const proof_type_id = searchParams.get("proof_type_id");
  const nonce = searchParams.get("nonce");
  const session_key = searchParams.get("session_key");
  const tutorial = searchParams.get("tutorial");

  if (!app_id) {
    throw new Error("app id missing");
  }

  if (!public_key) {
    throw new Error("publicKey missing");
  }

  if (!proof_type_id) {
    throw new Error("proof type id missing");
  }

  if (!nonce) {
    throw new Error("nonce missing");
  }

  if (!session_key) {
    throw new Error("session_key missing");
  }

  const args: VerifyProofArgs = {
    app_id,
    nonce: Number(nonce),
    public_key,
    proof_type_id,
    session_key,
  };

  if (tutorial) {
    args.tutorial = JSON.parse(decodeURIComponent(tutorial));
  }

  return args;
}

export interface VerifyProofArgs {
  nonce: number;
  app_id: string;
  proof_type_id: string;
  public_key: string;
  session_key: string;
  tutorial?: TutorialArgs;
}

export interface VerifyProofResultPayload {
  error?: string;
  result: boolean;
}
