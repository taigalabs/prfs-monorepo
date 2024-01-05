export interface PrfsIdMsg<T> {
  type: PrfsIdMsgType;
  error?: any;
  payload: T;
}

export interface StorageMsg<T> {
  _phantom?: T;
  appId: string;
  // key: string;
  value: string;
}

export interface RequestPayload {
  appId: string;
  data?: any;
}

export interface SignInSuccessPayload {
  account_id: string;
  public_key: string;
}

export interface CommitmentSuccessPayload {
  receipt: Record<string, string>;
}

export interface ProofGenSuccessPayload {
  receipt: Record<string, any>;
}

export type PrfsIdMsgType =
  //
  | "HANDSHAKE"
  | "HANDSHAKE_ACK"
  | "SIGN_IN_RESULT"
  | "SIGN_IN_RESULT_ACK"
  | "COMMITMENT_RESULT"
  | "COMMITMENT_RESULT_ACK"
  | "PROOF_GEN_RESULT"
  | "PROOF_GEN_RESULT_ACK"
  | "REQUEST_SIGN_IN"
  | "REQUEST_PROOF_GEN"
  | "REQUEST_VERIFY_PROOF";

export function newPrfsIdMsg<T extends PrfsIdMsgType>(
  type: PrfsIdMsgType,
  payload: MsgPayload<T>,
): PrfsIdMsg<any> {
  return {
    type,
    payload,
  };
}

export function newPrfsIdErrorMsg<T extends PrfsIdMsgType>(
  type: PrfsIdMsgType,
  payload: MsgPayload<T>,
): PrfsIdMsg<any> {
  return {
    type,
    error: payload,
    payload: null,
  };
}

type MsgPayload<T extends PrfsIdMsgType> = //
  T extends "SIGN_IN_RESULT"
    ? StorageMsg<SignInSuccessPayload>
    : T extends "COMMITMENT_RESULT"
    ? StorageMsg<CommitmentSuccessPayload>
    : T extends "PROOF_GEN_RESULT"
    ? StorageMsg<ProofGenSuccessPayload>
    : T extends "REQUEST_SIGN_IN"
    ? RequestPayload
    : T extends "REQUEST_PROOF_GEN"
    ? RequestPayload
    : T extends "REQUEST_VERIFY_PROOF"
    ? RequestPayload
    : null;
