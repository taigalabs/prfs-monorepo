export interface PrfsIdMsg<T> {
  type: PrfsIdMsgType;
  error?: any;
  payload: T;
}

export interface StorageMsg<T> {
  _phantom?: T;
  appId: string;
  key: string;
  value: string;
}

export interface RequestPayload {
  appId: string;
}

export interface SignInSuccessPayload {
  account_id: string;
  public_key: string;
}

export interface CommitmentSuccessPayload {
  receipt: Record<string, string>;
}

export type PrfsIdMsgType =
  //
  | "HANDSHAKE"
  | "HANDSHAKE_ACK"
  | "SIGN_IN_SUCCESS"
  | "SIGN_IN_SUCCESS_ACK"
  | "COMMITMENT_SUCCESS"
  | "COMMITMENT_SUCCESS_ACK"
  | "REQUEST_SIGN_IN"
  | "REQUEST_PROOF_GEN"
  | "ERROR";

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
  T extends "SIGN_IN_SUCCESS"
    ? StorageMsg<SignInSuccessPayload>
    : T extends "COMMITMENT_SUCCESS"
    ? StorageMsg<CommitmentSuccessPayload>
    : T extends "REQUEST_SIGN_IN"
    ? RequestPayload
    : T extends "REQUEST_PROOF_GEN"
    ? RequestPayload
    : T extends "ERROR"
    ? any
    : null;
