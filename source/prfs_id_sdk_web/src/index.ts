export * from "./msg";
export * from "./local_storage";
export * from "./api";

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

// export interface PrfsIdSuccessMsg {
//   type: "SIGN_IN_SUCCESS;
//   payload: Buffer; // SignInSuccessPayload;
// }

export interface PrfsIdCommitmentSuccessMsg {
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

export type PrfsIdMsgType = "SIGN_IN_SUCCESS" | "SIGN_IN_SUCCESS_RESPOND" | "COMMITMENT_SUCCESS";
