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
    if (ev.key) {
      const port = messageQueue.dequeue(ev.key);
      if (port) {
        port.postMessage(ev.newValue);
      }
    }
  }

  window.addEventListener("storage", listener);
  return listener;
}
