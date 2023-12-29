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
  | "HANDSHAKE_RESPOND"
  | "SIGN_IN_SUCCESS"
  | "SIGN_IN_SUCCESS_RESPOND"
  | "COMMITMENT_SUCCESS"
  | "COMMITMENT_SUCCESS_RESPOND";

export function newPrfsIdMsg(type: PrfsIdMsgType, payload: any): PrfsIdMsg<any> {
  return {
    type,
    payload,
  };
}
