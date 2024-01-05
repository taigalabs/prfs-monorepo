import { StorageMsg } from "./msg";
import { MessageQueue } from "./queue";

const KEY = "prfs_msg";

export function createStorageKey(appId: string) {
  return `${KEY}__${appId}`;
}

// export function dispatchStorageRequest(msg: StorageMsg<any>) {
//   const ky = createStorageKey(msg.appId);
//   window.localStorage.setItem(ky, msg.value);
// }

export function dispatchStorageMsg(msg: StorageMsg<any>) {
  if (msg.appId) {
    const ky = createStorageKey(msg.appId);
    window.localStorage.setItem(ky, msg.value);
  } else {
    console.error("Storage msg needs appId");
  }
}

export async function setupStorageListener(messageQueue: MessageQueue) {
  async function listener(ev: StorageEvent) {
    if (ev.key) {
      const port = messageQueue.dequeue(ev.key);
      if (port) {
        port.postMessage(ev.newValue);
        window.localStorage.removeItem(ev.key);
      }
    }
  }

  window.addEventListener("storage", listener);
  return listener;
}
