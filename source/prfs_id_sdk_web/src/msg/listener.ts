import {
  PrfsIdMsg,
  SignInSuccessPayload,
  StorageMsg,
  RequestPayload,
  // CommitmentSuccessPayload,
  ProofGenSuccessPayload,
} from "./msg";
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
              resolve(childListenerRef);
              ev.ports[0].postMessage(true);
              break;
            }
            default:
              console.error(`invalid msg type, ${data.type}`);
              reject(childListenerRef);
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
      console.log("parent msg ", ev.data, ev.ports);
      const data = ev.data as PrfsIdMsg<any>;

      if (data.type) {
        switch (data.type) {
          // inner communication
          case "GET_MSG": {
            if (data.payload) {
              const { appId } = data.payload as RequestPayload;
              if (appId) {
                const ky = createStorageKey(appId);
                const val = window.localStorage.getItem(ky);
                ev.ports[0].postMessage(val);
              } else {
                console.error("msg doesn't have a storage key, type: %s", data.type);
              }
            }
            break;
          }

          // inbound (host => id)
          case "REQUEST_SIGN_IN":
          case "REQUEST_VERIFY_PROOF":
          case "REQUEST_PROOF_GEN": {
            if (data.payload) {
              const { appId, data: d } = data.payload as RequestPayload;
              if (appId) {
                const ky = createStorageKey(appId);
                queue.push(ky, ev.ports[0]);

                if (d) {
                  dispatchStorageMsg({ appId, value: d });
                }
              } else {
                console.error("msg doesn't have a storage key, type: %s", data.type);
              }
            }
            break;
          }

          // outbound (id => host)
          // case "COMMITMENT_RESULT": {
          //   if (data.payload) {
          //     const payload = data.payload as StorageMsg<CommitmentSuccessPayload>;
          //     dispatchStorageMsg(payload);
          //   } else {
          //     console.error("msg doesn't contain payload");
          //   }
          //   ev.ports[0].postMessage(true);
          //   break;
          // }

          case "SIGN_IN_RESULT": {
            if (data.payload) {
              const payload = data.payload as StorageMsg<SignInSuccessPayload>;
              dispatchStorageMsg(payload);
            } else {
              console.error("msg doesn't contain payload");
            }
            ev.ports[0].postMessage(true);
            break;
          }

          case "PROOF_GEN_RESULT": {
            if (data.payload) {
              const payload = data.payload as StorageMsg<ProofGenSuccessPayload>;
              dispatchStorageMsg(payload);
            } else {
              console.error("msg doesn't contain payload");
            }
            ev.ports[0].postMessage(true);
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
