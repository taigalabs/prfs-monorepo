import { StorageMsg } from "./msg";
import { MessageQueue } from "./queue";

const KEY = "prfs_msg";

export function createStorageKey(key: string) {
  return `${KEY}__${key}`;
}

export function dispatchStorageMsg(msg: StorageMsg<any>) {
  if (msg.key && msg.value) {
    const ky = createStorageKey(msg.key);
    window.localStorage.setItem(ky, msg.value);
  }
}

export async function setupStorageListener(messageQueue: MessageQueue) {
  async function listener(ev: StorageEvent) {
    console.log(11, ev);

    if (ev.key) {
      const postMsg = messageQueue.dequeue(ev.key);
      if (postMsg) {
        console.log("sending new value", ev.newValue);
        // postMsg(ev.newValue);
        (postMsg as any).postMessage("powpeor");
      }
    }
  }

  window.addEventListener("storage", listener);
  return listener;
}
