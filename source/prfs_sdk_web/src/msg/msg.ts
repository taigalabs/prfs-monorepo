import { MsgType, ReqPayload } from "./payload";

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
