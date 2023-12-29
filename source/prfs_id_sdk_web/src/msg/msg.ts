export interface PrfsIdMsg<T> {
  type: PrfsIdMsgType;
  error?: any;
  payload: T;
}

export interface PrfsIdSignInSuccessMsg {
  type: "SIGN_IN_SUCCESS";
  payload: Buffer; // SignInSuccessPayload;
}

export interface PrfsIdSignInSuccessPayload {
  account_id: string;
  public_key: string;
}

export interface PrfsIdCommitmentSuccessPayload {
  receipt: Record<string, string>;
}

export type PrfsIdMsgType =
  //
  | "HANDSHAKE"
  | "HANDSHAKE_ACK"
  | "SIGN_IN_SUCCESS"
  | "SIGN_IN_SUCCESS_ACK"
  | "COMMITMENT_SUCCESS"
  | "COMMITMENT_SUCCESS_ACK";

export function newPrfsIdMsg(type: PrfsIdMsgType, payload: any): PrfsIdMsg<any> {
  return {
    type,
    payload,
  };
}
