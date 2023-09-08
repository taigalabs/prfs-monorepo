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

export class MsgBase<T, R> {
  error?: any;
  type: MsgType;
  payload: T | undefined;
  _type?: R;

  constructor(type: MsgType, payload: T, error?: any) {
    this.type = type;
    this.payload = payload;
    this.error = error;
  }
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

export interface HandshakePayload {
  docHeight: number;
}

export interface HandshakeResponsePayload {
  // prfsAssetEndpoint: string;
}

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

type MsgType =
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

type Req<T extends MsgType> = //
  T extends "HANDSHAKE"
    ? HandshakePayload
    : T extends "HANDSHAKE_RESPONSE"
    ? HandshakeResponsePayload
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

type Resp<T extends MsgType> = //
  T extends "HANDSHAKE"
    ? HandshakePayload
    : T extends "HANDSHAKE_RESPONSE"
    ? HandshakeResponsePayload
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
    : any;

// export async function prfsApi2<T extends RequestName>(name: T, req: Req<T>): Promise<Resp<T>> {
//   return (await api({
//     path: name,
//     req,
//   })) as Resp<T>;
// }
