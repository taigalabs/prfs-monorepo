import {
  sendMsgToParent,
  newPrfsIdMsg,
  setupParentMsgHandler,
  MessageQueue,
  setupStorageListener,
} from "@taigalabs/prfs-id-sdk-web";

async function main() {
  const currUrl = window.location.protocol + window.location.host;
  console.log("[prfs-embed] Start prfs embed webapp, served from: %s", currUrl);

  const messageQueue = new MessageQueue();
  setupStorageListener(messageQueue);
  setupParentMsgHandler(messageQueue);

  await sendMsgToParent(newPrfsIdMsg("HANDSHAKE", null));
  console.log("[prfs-embed] Handshaked with parent");
}

main().then();
