export enum MsgType {
  HANDSHAKE = "HANDSHAKE",
  HANDSHAKE_RESPONSE = "HANDSHAKE_RESPONSE",
  GET_ADDRESS = "GET_ADDRESS",
  GET_ADDRESS_RESPONSE = "GET_ADDRESS_RESPONSE",
  GET_SIGNATURE = "GET_SIGNATURE",
  GET_SIGNATURE_RESPONSE = "GET_SIGNATURE_RESPONSE",
}

export interface MsgInterface<T> {
  error?: any;
  type: MsgType;
  payload: T;
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
