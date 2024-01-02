import {
  sendMsgToParent,
  newPrfsIdMsg,
  setupParentMsgHandler,
  MessageQueue,
  setupStorageListener,
} from "@taigalabs/prfs-id-sdk-web";

async function main() {
  console.log("[prfs-embed] Start prfs embed webapp");

  const messageQueue = new MessageQueue();
  setupStorageListener(messageQueue);
  setupParentMsgHandler(messageQueue);
  await sendMsgToParent(newPrfsIdMsg("HANDSHAKE", null));

  console.log("[prfs-embed] Handshaked with parent");
}

main().then();
