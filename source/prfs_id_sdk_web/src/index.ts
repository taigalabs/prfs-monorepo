export * from "./msg";
export * from "./query_string";
export * from "./local_storage";

export function newPrfsIdMsg(type: PrfsIdMsgType, payload: any): PrfsIdMsg<any> {
  return {
    type,
    payload,
  };
}

export interface PrfsIdMsg<T> {
  type: PrfsIdMsgType;
  payload: T;
}

export interface PrfsIdSignInSuccessMsg {
  type: "SIGN_IN_SUCCESS";
  payload: Buffer; // SignInSuccessPayload;
}

export interface PrfsIdSignInSuccessPayload {
  id: string;
  publicKey: string;
}

export type PrfsIdMsgType = "SIGN_IN_SUCCESS" | "SIGN_IN_SUCCESS_RESPOND";
