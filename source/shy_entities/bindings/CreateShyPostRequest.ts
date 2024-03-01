// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ShyPostProofAction } from "./ShyPostProofAction";

export interface CreateShyPostRequest {
  title: string;
  post_id: string;
  content: string;
  channel_id: string;
  shy_post_proof_id: string;
  proof_identity_input: string;
  proof: Array<number>;
  public_inputs: string;
  public_key: string;
  proof_action: ShyPostProofAction;
}
