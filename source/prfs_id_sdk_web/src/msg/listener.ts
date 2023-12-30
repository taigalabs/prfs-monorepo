import { PrfsIdMsg, newPrfsIdMsg } from "./msg";

const parentListenerRef: ListenerRef = {
  current: null,
};

const childListenerRef: ListenerRef = {
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
              console.log("replying handshake ack");
              ev.ports[0].postMessage(newPrfsIdMsg("HANDSHAKE_ACK", {}));
              resolve(childListenerRef);
              break;
            }
            default:
              console.error(`invalid msg type, ${data.type}`);
              reject();
          }
        }
      }
    }

    if (childListenerRef.current === null) {
      childListenerRef.current = listener;
      window.addEventListener("message", listener);
    }
  });
}

export function setupParentMsgHandler() {
  function listener(ev: MessageEvent) {
    if (ev.ports.length > 0) {
      console.log("parent msg", ev.data);
      const data = ev.data as PrfsIdMsg<any>;

      if (data.type) {
        switch (data.type) {
          // case "HANDSHAKE_ACK": {
          //   // ev.ports[0].postMessage(newPrfsIdMsg("HANDSHAKE_ACK", {}));
          //   break;
          // }
          default:
            console.error(`invalid msg type, ${data.type}`);
        }
      }
    }
  }

  if (parentListenerRef.current === null) {
    parentListenerRef.current = listener;
    window.addEventListener("message", listener);
    console.log("Attaching parent msg listener");
  }

  return parentListenerRef;
}

export interface ListenerRef {
  current: ((ev: MessageEvent) => void) | null;
}
