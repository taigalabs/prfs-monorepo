import { LogEventType, ProveReceipt } from "@taigalabs/prfs-driver-interface";

export type MsgType =
  | "HANDSHAKE"
  | "HANDSHAKE_RESPONSE"
  | "LOAD_DRIVER"
  | "LOAD_DRIVER_RESPONSE"
  | "GET_ADDRESS"
  | "GET_ADDRESS_RESPONSE"
  | "GET_SIGNATURE"
  | "GET_SIGNATURE_RESPONSE"
  | "CREATE_PROOF"
  | "CREATE_PROOF_RESPONSE"
  | "PROOF_GEN_EVENT"
  | "PROOF_GEN_EVENT_RESPONSE";

export interface HandshakePayload {}

export interface HandshakeResponsePayload {}

export interface ProofGenEventPayload {
  type: LogEventType;
  msg: string;
}

export interface LoadDriverPayload {
  circuit_driver_id: string;
  driver_properties: Record<string, any>;
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
    ? HandshakeResponsePayload
    : T extends "GET_ADDRESS"
    ? string
    : T extends "GET_ADDRESS_RESPONSE"
    ? string
    : T extends "LOAD_DRIVER"
    ? LoadDriverPayload
    : T extends "LOAD_DRIVER_RESPONSE"
    ? string
    : T extends "GET_SIGNATURE"
    ? GetSignaturePayload
    : T extends "GET_SIGNATURE_RESPONSE"
    ? GetSignatureResponsePayload
    : T extends "CREATE_PROOF"
    ? Record<string, any>
    : T extends "CREATE_PROOF_RESPONSE"
    ? ProveReceipt
    : T extends "PROOF_GEN_EVENT"
    ? ProofGenEventPayload
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
    : T extends "LOAD_DRIVER"
    ? string
    : T extends "LOAD_DRIVER_RESPONSE"
    ? never
    : T extends "CREATE_PROOF"
    ? ProveReceipt
    : T extends "CREATE_PROOF_RESPONSE"
    ? void
    : T extends "PROOF_GEN_EVENT"
    ? never
    : T extends "PROOF_GEN_EVENT_RESPONSE"
    ? never
    : never;
