import { ProveReceipt, ProveResult } from "@taigalabs/prfs-driver-interface";

export type MsgType =
  | "HANDSHAKE"
  | "HANDSHAKE_RESPONSE"
  | "GET_ADDRESS"
  | "GET_ADDRESS_RESPONSE"
  | "GET_SIGNATURE"
  | "GET_SIGNATURE_RESPONSE"
  | "LISTEN_CLICK_OUTSIDE"
  | "LISTEN_CLICK_OUTSIDE_RESPONSE"
  | "LISTEN_CREATE_PROOF"
  | "LISTEN_CREATE_PROOF_RESPONSE"
  | "STOP_CLICK_OUTSIDE"
  | "STOP_CLICK_OUTSIDE_RESPONSE"
  | "CREATE_PROOF"
  | "CREATE_PROOF_RESPONSE"
  | "OPEN_DIALOG"
  | "OPEN_DIALOG_RESPONSE";

export class Msg<T extends MsgType> implements MsgInterface<T> {
  error?: any;
  type: T;
  payload: any;

  constructor(type: T, payload: ReqPayload<T>, error?: any) {
    this.type = type;
    this.payload = payload || {};
    this.error = error;
  }
}

export interface MsgInterface<T extends MsgType> {
  error?: any;
  type: T;
  payload: ReqPayload<T>;
}

export interface HandshakePayload {
  docHeight: number;
}

export interface GetSignaturePayload {
  msgRaw: string;
}

export interface GetSignatureResponsePayload {
  msgHash: Buffer;
  sig: string;
}

export type ReqPayload<T extends MsgType> = //
  T extends "HANDSHAKE"
    ? HandshakePayload
    : T extends "HANDSHAKE_RESPONSE"
    ? void
    : T extends "GET_ADDRESS"
    ? string
    : T extends "GET_ADDRESS_RESPONSE"
    ? string
    : T extends "GET_SIGNATURE"
    ? GetSignaturePayload
    : T extends "GET_SIGNATURE_RESPONSE"
    ? GetSignatureResponsePayload
    : T extends "LISTEN_CLICK_OUTSIDE"
    ? void
    : T extends "LISTEN_CLICK_OUTSIDE_RESPONSE"
    ? boolean
    : T extends "LISTEN_CREATE_PROOF"
    ? void
    : T extends "LISTEN_CREATE_PROOF_RESPONSE"
    ? boolean
    : T extends "STOP_CLICK_OUTSIDE"
    ? void
    : T extends "STOP_CLICK_OUTSIDE_RESPONSE"
    ? void
    : T extends "CREATE_PROOF"
    ? void
    : T extends "CREATE_PROOF_RESPONSE"
    ? ProveReceipt
    : T extends "OPEN_DIALOG"
    ? void
    : T extends "OPEN_DIALOG_RESPONSE"
    ? void
    : never;

export type RespPayload<T extends MsgType> = //
  T extends "HANDSHAKE"
    ? void
    : T extends "HANDSHAKE_RESPONSE"
    ? never
    : T extends "GET_ADDRESS"
    ? string
    : T extends "GET_ADDRESS_RESPONSE"
    ? never
    : T extends "GET_SIGNATURE"
    ? GetSignatureResponsePayload
    : T extends "GET_SIGNATURE_RESPONSE"
    ? never
    : T extends "LISTEN_CLICK_OUTSIDE"
    ? boolean
    : T extends "LISTEN_CLICK_OUTSIDE_RESPONSE"
    ? never
    : T extends "LISTEN_CREATE_PROOF"
    ? boolean
    : T extends "LISTEN_CREATE_PROOF_RESPONSE"
    ? never
    : T extends "STOP_CLICK_OUTSIDE"
    ? void
    : T extends "STOP_CLICK_OUTSIDE_RESPONSE"
    ? void
    : T extends "CREATE_PROOF"
    ? ProveReceipt
    : T extends "CREATE_PROOF_RESPONSE"
    ? void
    : T extends "OPEN_DIALOG"
    ? void
    : T extends "OPEN_DIALOG_RESPONSE"
    ? void
    : never;
