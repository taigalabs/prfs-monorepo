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

export interface RequestSignInPayload {
  storageKey: string;
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
  | "REQUEST_SIGN_IN";

export function newPrfsIdMsg<T extends PrfsIdMsgType>(
  type: PrfsIdMsgType,
  payload: MsgPayload<T>,
): PrfsIdMsg<any> {
  return {
    type,
    payload,
  };
}

type MsgPayload<T extends PrfsIdMsgType> = //
  T extends "SIGN_IN_SUCCESS"
    ? StorageMsg<SignInSuccessPayload>
    : T extends "REQUEST_SIGN_IN"
    ? RequestSignInPayload
    : null;
