// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.

export interface CreateShyPostWithProofRequest {
  topic_id: string;
  channel_id: string;
  shy_topic_proof_id: string;
  post_id: string;
  content: string;
  author_public_key: string;
  author_sig: string;
  author_sig_msg: Array<number>;
  proof_identity_input: string;
  proof: Array<number>;
  public_inputs: string;
  serial_no: string;
  sub_channel_id: string;
}