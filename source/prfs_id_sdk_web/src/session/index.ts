export * from "./session_key";

import { PrfsIdSessionMsg } from "@taigalabs/prfs-entities/bindings/PrfsIdSessionMsg";
import { PrfsIdSessionResponse } from "@taigalabs/prfs-entities/bindings/PrfsIdSessionResponse";

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_ID_SESSION_SOCKET_ENDPOINT) {
    throw new Error("id session api endpoint not defined");
  }
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_ID_SESSION_SOCKET_ENDPOINT}/id_session_api/v0`;
} else {
  throw new Error("process is undefined");
}

export interface PrfsIdSessionStream {
  ws: WebSocket;
  receive: () => Promise<PrfsIdSessionResponse | undefined>;
  send: (data: PrfsIdSessionMsg) => void;
}

export interface CreateSessionArgs {
  key: string;
  value: number[] | null;
  ticket: string;
}
