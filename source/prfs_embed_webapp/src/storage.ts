import { MessageQueue } from "@taigalabs/prfs-id-sdk-web";

export async function setupStorageListener(messageQueue: MessageQueue) {
  console.log("start storage event listening");

  async function listener(ev: StorageEvent) {
    console.log(11, ev);
    // if (ev.ports.length > 0) {
    //   // const type: MsgType = ev.data.type;
    //   // console.log("Msg, type: %s", type);
    // }
  }

  window.addEventListener("storage", listener);
  return listener;
}
