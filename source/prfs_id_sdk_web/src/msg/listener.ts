import { PrfsIdMsg, PrfsIdSignInSuccessPayload, newPrfsIdMsg } from "./msg";
import { MessageQueue } from "./queue";

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

export function setupParentMsgHandler(queue: MessageQueue) {
  function listener(ev: MessageEvent) {
    if (ev.ports.length > 0) {
      console.log("parent msg", ev.data);
      const data = ev.data as PrfsIdMsg<any>;

      if (data.type) {
        switch (data.type) {
          case "REQUEST_SIGN_IN": {
            if (data.payload) {
              const { publicKey } = data.payload;
              if (publicKey) {
                queue.push(publicKey, ev.ports[0].postMessage);
              }
            }
            break;
          }
          case "SIGN_IN_SUCCESS": {
            if (data.payload) {
              const payload = data.payload;
              window.localStorage.setItem(payload.publicKey, payload.encrypted);
              // if (payload.publicKey) {
              //   const key = `prfs_msg__${payload.publicKey}`;
              //   window.localStorage.setItem(key, JSON.stringify(payload.encrypted));
              // }
            }
            break;
          }
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
