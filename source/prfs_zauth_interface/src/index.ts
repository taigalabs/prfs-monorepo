export * from "./msg";

export function newZAuthMsg(type: string, payload: any) {}

export interface ZAuthMsg<T> {
  type: string;
  payload: T;
}

export interface SignInSuccessZAuthMsg {
  type: "SIGN_IN_SUCCESS";
  payload: string; // SignInSuccessPayload;
}

export interface SignInSuccessPayload {
  id: string;
  publicKey: string;
}
