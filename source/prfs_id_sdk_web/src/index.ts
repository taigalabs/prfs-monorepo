export * from "./msg";

export function newZAuthMsg(type: ZAuthMsgType, payload: any): ZAuthMsg<any> {
  return {
    type,
    payload,
  };
}

export interface ZAuthMsg<T> {
  type: string;
  payload: T;
}

export interface SignInSuccessZAuthMsg {
  type: "SIGN_IN_SUCCESS";
  payload: Buffer; // SignInSuccessPayload;
}

export interface SignInSuccessPayload {
  id: string;
  publicKey: string;
}

export type ZAuthMsgType = "SIGN_IN_SUCCESS" | "SIGN_IN_SUCCESS_RESPOND";
