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

export async function createSession({
  key,
  value,
  ticket,
}: CreateSessionArgs): Promise<PrfsIdSessionStream> {
  const callbackQueue: { resolve: (data: PrfsIdSessionResponse) => void; reject: () => void }[] =
    [];
  const dataQueue: PrfsIdSessionResponse[] = [];

  const prom = new Promise<PrfsIdSessionStream>((resolve, _reject) => {
    const ws = new WebSocket(`${endpoint}/open_prfs_id_session`);

    async function receive() {
      if (dataQueue.length !== 0) {
        // We have a message ready.
        return Promise.resolve(dataQueue.shift());
      }

      const promise = new Promise<PrfsIdSessionResponse>((resolve, reject) => {
        callbackQueue.push({ resolve, reject });
      });

      return promise;
    }

    function send(data: PrfsIdSessionMsg) {
      const stringified = JSON.stringify(data);
      ws.send(stringified);
    }

    ws.onopen = () => {
      console.log("Prfs id session established!");
      resolve({
        ws,
        receive,
        send,
      });
    };

    ws.onmessage = ev => {
      try {
        let data = JSON.parse(ev.data);
        if (callbackQueue.length !== 0) {
          // Somebody is waiting to receive this message.
          const elem = callbackQueue.shift();
          if (elem) {
            elem.resolve(data);
          }
          return;
        }
        dataQueue.push(data);
      } catch (err) {
        console.error("Failed to parse the session response, err: %s, data: %s", err, ev.data);
      }
    };
  });

  const { ws, send, receive } = await prom;
  send({
    type: "open_prfs_id_session",
    key,
    value,
    ticket,
  });

  const openSessionResp = await receive();
  if (openSessionResp?.error) {
    return Promise.reject(null);
  }

  return {
    ws,
    send,
    receive,
  };
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
