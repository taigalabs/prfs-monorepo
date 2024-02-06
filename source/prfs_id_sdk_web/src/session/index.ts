import {} from "@taigalabs/prfs-entities/bindings/PrfsIdSessionMsg";

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_ID_SESSION_SOCKET_ENDPOINT) {
    throw new Error("id session api endpoint not defined");
  }
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_ID_SESSION_SOCKET_ENDPOINT}/id_session_api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function openSession(): Promise<PrfsIdSession> {
  const callbackQueue: { resolve: (data: any) => void; reject: () => void }[] = [];
  const dataQueue: any[] = [];

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`${endpoint}/open_session`);

    async function receive() {
      if (dataQueue.length !== 0) {
        // We have a message ready.
        return Promise.resolve(dataQueue.shift());
      }

      const promise = new Promise((resolve, reject) => {
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
      ws.send(JSON.stringify({ a: 1 }));
      resolve({
        ws,
        receive,
        send,
      });
    };

    ws.onmessage = ev => {
      if (callbackQueue.length !== 0) {
        // Somebody is waiting to receive this message.
        const elem = callbackQueue.shift();
        if (elem) {
          elem.resolve(ev.data);
        }
        return;
      }
      dataQueue.push(ev.data);
    };
  });
}

export interface PrfsIdSession {
  ws: WebSocket;
  receive: () => Promise<any>;
  send: (data: any) => void;
}
