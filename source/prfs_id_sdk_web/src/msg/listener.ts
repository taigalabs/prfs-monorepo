import { PrfsIdMsg, newPrfsIdMsg } from "./msg";

const listenerRef: ListenerRef = {
  current: null,
};

export function setupChildMsgHandler() {
  return new Promise<ListenerRef>((resolve, reject) => {
    function listener(ev: MessageEvent) {
      if (ev.ports.length > 0) {
        console.log("child msg", ev.data);
        const data = ev.data as PrfsIdMsg<any>;

        if (data.type) {
          switch (data.type) {
            case "HANDSHAKE": {
              ev.ports[0].postMessage(newPrfsIdMsg("HANDSHAKE_ACK", {}));
              resolve(listenerRef);
              break;
            }
            default:
              console.error(`invalid msg type, ${data.type}`);
              reject();
          }
        }
      }
    }

    if (listenerRef.current === null) {
      listenerRef.current = listener;
      window.addEventListener("message", listener);
    }
  });
}

export function setupParentMsgHandler() {
  function listener(ev: MessageEvent) {
    if (ev.ports.length > 0) {
      console.log("child msg", ev.data);
      const data = ev.data as PrfsIdMsg<any>;

      if (data.type) {
        switch (data.type) {
          case "HANDSHAKE": {
            ev.ports[0].postMessage(newPrfsIdMsg("HANDSHAKE_ACK", {}));
            // resolve(listenerRef);
            break;
          }
          default:
            console.error(`invalid msg type, ${data.type}`);
          // reject();
        }
      }
    }
  }

  if (listenerRef.current === null) {
    listenerRef.current = listener;
    window.addEventListener("message", listener);
  }
}

export interface ListenerRef {
  current: ((ev: MessageEvent) => void) | null;
}
