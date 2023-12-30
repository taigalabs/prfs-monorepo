import { PrfsIdMsg, SignInSuccessPayload, StorageMsg, newPrfsIdMsg } from "./msg";
import { MessageQueue } from "./queue";
import { createStorageKey, dispatchStorageMsg } from "./storage";

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
              ev.ports[0].postMessage(newPrfsIdMsg("HANDSHAKE_ACK", null));
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
      console.log("parent msg", ev.data, ev.ports);
      const data = ev.data as PrfsIdMsg<any>;

      if (data.type) {
        switch (data.type) {
          case "REQUEST_SIGN_IN": {
            if (data.payload) {
              const { storageKey } = data.payload;
              if (storageKey) {
                console.log("reply");
                ev.ports[0].postMessage("po123");
                const ky = createStorageKey(storageKey);
                // queue.push(ky, ev.ports[0].postMessage);
                queue.push(ky, ev.ports[0] as any);
              } else {
                console.error("msg doesn't have a storage key, type: %s", data.type);
              }
            }
            break;
          }
          case "SIGN_IN_SUCCESS": {
            if (data.payload) {
              const payload = data.payload as StorageMsg<SignInSuccessPayload>;
              if (payload) {
                dispatchStorageMsg(payload);
              }
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
