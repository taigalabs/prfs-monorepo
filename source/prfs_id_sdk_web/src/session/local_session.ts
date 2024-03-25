export const PRFS_LOCAL_SESSION_KEY = "prfs_local_session_key";

export async function createLocalSession({
  key,
  value,
}: // ticket,
CreateLocalSessionArgs): Promise<null> {
  window.localStorage.setItem(PRFS_LOCAL_SESSION_KEY, value);

  return null;
  // const callbackQueue: { resolve: (data: PrfsIdSessionResponse) => void; reject: () => void }[] =
  //   [];
  // const dataQueue: PrfsIdSessionResponse[] = [];
  // const ws = new WebSocket(`${endpoint}/open_prfs_id_session`);
  // const prom = new Promise<Omit<PrfsIdSessionStream, "ws">>((resolve, _reject) => {
  //   async function receive() {
  //     if (dataQueue.length !== 0) {
  //       return Promise.resolve(dataQueue.shift());
  //     }
  //     const promise = new Promise<PrfsIdSessionResponse>((resolve, reject) => {
  //       callbackQueue.push({ resolve, reject });
  //     });
  //     return promise;
  //   }
  //   function send(data: PrfsIdSessionMsg) {
  //     const stringified = JSON.stringify(data);
  //     ws.send(stringified);
  //   }
  //   ws.onopen = () => {
  //     console.log("Prfs id session established!, key: %s", key);
  //     resolve({
  //       receive,
  //       send,
  //     });
  //   };
  //   ws.onmessage = ev => {
  //     try {
  //       let data = JSON.parse(ev.data);
  //       if (callbackQueue.length !== 0) {
  //         // Somebody is waiting to receive this message.
  //         const elem = callbackQueue.shift();
  //         if (elem) {
  //           elem.resolve(data);
  //         }
  //         return;
  //       }
  //       dataQueue.push(data);
  //     } catch (err) {
  //       console.error("Failed to parse the session response, err: %s, data: %s", err, ev.data);
  //     }
  //   };
  // });
  // try {
  //   const { send, receive } = await prom;
  //   send({
  //     type: "open_prfs_id_session",
  //     key,
  //     value,
  //     ticket,
  //   });
  //   const openSessionResp = await receive();
  //   if (openSessionResp?.error) {
  //     ws.close();
  //     return null;
  //   }
  //   return {
  //     ws,
  //     send,
  //     receive,
  //   };
  // } catch (err) {
  //   ws.close();
  //   return null;
  // }
}

export interface CreateLocalSessionArgs {
  key: string;
  value: string;
  // ticket: string;
}
