export enum MsgType {
  HANDSHAKE = "HANDSHAKE",
  HANDSHAKE_RESPONSE = "HANDSHAKE_RESPONSE",
  GET_ADDRESS = "GET_ADDRESS",
  GET_ADDRESS_RESPONSE = "GET_ADDRESS_RESPONSE",
  GET_SIGNATURE = "GET_SIGNATURE",
  GET_SIGNATURE_RESPONSE = "GET_SIGNATURE_RESPONSE",
  CREATE_PROOF = "CREATE_PROOF",
  CREATE_PROOF_RESPONSE = "CREATE_PROOF_RESPONSE",
  DRIVER_LOAD_RESULT = "DRIVER_LOAD_RESULT",
  DRIVER_LOAD_RESULT_RESPONSE = "DRIVER_LOAD_RESULT_RESPONSE",
}

export interface MsgInterface<T> {
  error?: any;
  type: MsgType;
  payload: T | undefined;
}

export class HandshakeMsg implements MsgInterface<string> {
  type: MsgType;
  payload: string;

  constructor(payload: string) {
    this.type = MsgType.HANDSHAKE;
    this.payload = payload;
  }
}

export class HandshakeResponseMsg implements MsgInterface<string> {
  type: MsgType;
  payload: string;

  constructor(payload: string) {
    this.type = MsgType.HANDSHAKE_RESPONSE;
    this.payload = payload;
  }
}

export class GetAddressMsg implements MsgInterface<string> {
  type: MsgType;
  payload: string;

  constructor(payload: string) {
    this.type = MsgType.GET_ADDRESS;
    this.payload = payload;
  }
}

export class GetAddressResponseMsg implements MsgInterface<string> {
  type: MsgType;
  payload: string;

  constructor(payload: string) {
    this.type = MsgType.GET_ADDRESS_RESPONSE;
    this.payload = payload;
  }
}

export class GetSignatureMsg implements MsgInterface<Buffer> {
  type: MsgType;
  payload: Buffer;

  constructor(payload: Buffer) {
    this.type = MsgType.GET_SIGNATURE;
    this.payload = payload;
  }
}

export class GetSignatureResponseMsg implements MsgInterface<string> {
  type: MsgType;
  payload: string;

  constructor(payload: string) {
    this.type = MsgType.GET_SIGNATURE_RESPONSE;
    this.payload = payload;
  }
}

export class CreateProofMsg implements MsgInterface<CreateProofPayload> {
  type: MsgType;
  payload: CreateProofPayload;

  constructor(sig: Buffer, msgHash: Buffer, merkleProof: any) {
    this.type = MsgType.CREATE_PROOF;
    this.payload = {
      sig,
      msgHash,
      merkleProof,
    };
  }
}

export class DriverLoadResultMsg implements MsgInterface<DriverLoadResultPayload> {
  type: MsgType;
  payload: DriverLoadResultPayload;

  constructor(driverId: string) {
    this.type = MsgType.DRIVER_LOAD_RESULT;
    this.payload = {
      driverId,
    };
  }
}

export interface DriverLoadResultPayload {
  driverId: string;
}

export interface CreateProofPayload {
  sig: Buffer;
  msgHash: Buffer;
  merkleProof: any;
}

export class CreateProofResponseMsg implements MsgInterface<CreateProofResponsePayload> {
  error?: string;
  type: MsgType;
  payload: CreateProofResponsePayload | undefined;

  constructor(error?: string, payload?: CreateProofResponsePayload) {
    this.type = MsgType.CREATE_PROOF_RESPONSE;
    this.error = error;
    this.payload = payload;
  }
}

export interface CreateProofResponsePayload {
  proof: Uint8Array;
  publicInput: any;
}
