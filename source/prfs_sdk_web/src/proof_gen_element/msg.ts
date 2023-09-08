import { ProveReceipt, ProveResult } from "@taigalabs/prfs-driver-interface";

// export enum MsgType {
//   HANDSHAKE = "HANDSHAKE",
//   HANDSHAKE_RESPONSE = "HANDSHAKE_RESPONSE",
//   GET_ADDRESS = "GET_ADDRESS",
//   GET_ADDRESS_RESPONSE = "GET_ADDRESS_RESPONSE",
//   GET_SIGNATURE = "GET_SIGNATURE",
//   GET_SIGNATURE_RESPONSE = "GET_SIGNATURE_RESPONSE",
//   LISTEN_CLICK_OUTSIDE = "LISTEN_CLICK_OUTSIDE",
//   LISTEN_CLICK_OUTSIDE_RESPONSE = "LISTEN_CLICK_OUTSIDE_RESPONSE",
//   LISTEN_CREATE_PROOF = "LISTEN_CREATE_PROOF",
//   LISTEN_CREATE_PROOF_RESPONSE = "LISTEN_CREATE_PROOF_RESPONSE",
//   STOP_CLICK_OUTSIDE = "STOP_CLICK_OUTSIDE",
//   STOP_CLICK_OUTSIDE_RESPONSE = "STOP_CLICK_OUTSIDE_RESPONSE",
//   CREATE_PROOF = "CREATE_PROOF",
//   CREATE_PROOF_RESPONSE = "CREATE_PROOF_RESPONSE",
//   DRIVER_LOAD_RESULT = "DRIVER_LOAD_RESULT",
//   DRIVER_LOAD_RESULT_RESPONSE = "DRIVER_LOAD_RESULT_RESPONSE",
// }

// export class MsgBase<T extends MsgType, R extends RespMsgType<T>> {
//   error?: any;
//   type: MsgType;
//   payload: Payload<T> | any;

//   resp_msg_type?: R;

//   constructor(type: MsgType, payload: Payload<T>, error?: any) {
//     this.type = type;
//     this.payload = payload || {};
//     this.error = error;
//   }
// }
//
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

// export class HandshakeMsg extends MsgBase<HandshakePayload, HandshakeResponsePayload> {
//   constructor(payload: HandshakePayload) {
//     super(MsgType.HANDSHAKE, payload);
//   }
// }

// export class HandshakeResponseMsg extends MsgBase<HandshakeResponsePayload, never> {
//   constructor(payload: HandshakeResponsePayload) {
//     super(MsgType.HANDSHAKE_RESPONSE, payload);
//   }
// }
//
export interface HandshakePayload {
  docHeight: number;
}

export interface HandshakeRespPayload {}

// export interface HandshakeMsg extends MsgInterface<HandshakePayload, HandshakeRespPayload> {
//   type: "HANDSHAKE";
// }

// export interface HandshakeRespMsg extends MsgInterface<HandshakeRespPayload, never> {
//   type: "HANDSHAKE_RESPONSE";
// }

// export class GetAddressMsg extends MsgBase<string, string> {
//   constructor(payload: string) {
//     super(MsgType.GET_ADDRESS, payload);
//   }
// }

// export class GetAddressResponseMsg extends MsgBase<string, never> {
//   constructor(payload: string) {
//     super(MsgType.GET_ADDRESS_RESPONSE, payload);
//   }
// }

// export class GetSignatureMsg extends MsgBase<
//   GetSignatureMsgPayload,
//   GetSignatureMsgResponsePayload
// > {
//   constructor(payload: GetSignatureMsgPayload) {
//     super(MsgType.GET_SIGNATURE, payload);
//   }
// }

// export class GetSignatureResponseMsg extends MsgBase<GetSignatureMsgResponsePayload, never> {
//   constructor(payload: GetSignatureMsgResponsePayload) {
//     super(MsgType.GET_SIGNATURE_RESPONSE, payload);
//   }
// }

export interface GetSignaturePayload {
  msgRaw: string;
}

export interface GetSignatureResponsePayload {
  msgHash: Buffer;
  sig: string;
}

// export class ListenClickOutsideMsg extends MsgBase<void, boolean> {
//   constructor() {
//     super(MsgType.LISTEN_CLICK_OUTSIDE);
//   }
// }

// export class ListenClickOutsideResponseMsg extends MsgBase<boolean, void> {
//   constructor(isNewlyAttached: boolean) {
//     super(MsgType.LISTEN_CLICK_OUTSIDE_RESPONSE, isNewlyAttached);
//   }
// }

// export class StopClickOutsideMsg extends MsgBase<void, boolean> {
//   constructor() {
//     super(MsgType.STOP_CLICK_OUTSIDE);
//   }
// }

// export class ListenCreateProofMsg extends MsgBase<void, boolean> {
//   constructor() {
//     super(MsgType.LISTEN_CREATE_PROOF);
//   }
// }

// export class ListenCreateProofResponseMsg extends MsgBase<boolean, void> {
//   constructor(isNewlyAttached: boolean) {
//     super(MsgType.LISTEN_CREATE_PROOF_RESPONSE, isNewlyAttached);
//   }
// }

// export class CreateProofMsg extends MsgBase<void, ProveReceipt> {
//   constructor() {
//     super(MsgType.CREATE_PROOF);
//   }
// }

// export class CreateProofResponseMsg extends MsgBase<ProveReceipt, any> {
//   constructor(payload: ProveReceipt) {
//     super(MsgType.CREATE_PROOF_RESPONSE, payload);
//   }
// }

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
  | "CREATE_PROOF_RESPONSE";

// export type RespMsg<T> = T extends HandshakeMsg ? HandshakeRespMsg : never;

export type ReqPayload<T extends MsgType> = //
  T extends "HANDSHAKE"
    ? HandshakePayload
    : T extends "HANDSHAKE_RESPONSE"
    ? HandshakeRespPayload
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
    : never;

export type RespPayload<T extends MsgType> = //
  T extends "HANDSHAKE"
    ? HandshakeRespPayload
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
    ? never
    : never;
