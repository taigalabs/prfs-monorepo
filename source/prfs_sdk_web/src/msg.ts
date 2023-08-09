export enum MsgType {
  HANDSHAKE = "HANDSHAKE",
  HANDSHAKE_RESPONSE = "HANDSHAKE_RESPONSE",
  GET_ADDRESS = "GET_ADDRESS",
  GET_ADDRESS_RESPONSE = "GET_ADDRESS_RESPONSE",
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
