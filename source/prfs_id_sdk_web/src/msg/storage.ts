import { MessageQueue } from "./queue";

export async function setupStorageListener(messageQueue: MessageQueue) {
  console.log("start storage event listening");

  async function listener(ev: StorageEvent) {
    console.log(11, ev);

    if (ev.key) {
      const postMsg = messageQueue.dequeue(ev.key);
      if (postMsg) {
        console.log("sending new value", ev.newValue);
        postMsg(ev.newValue);
      }
    }
  }

  window.addEventListener("storage", listener);
  return listener;
}
