import {
  sendMsgToParent,
  newPrfsIdMsg,
  setupParentMsgHandler,
  MessageQueue,
  setupStorageListener,
} from "@taigalabs/prfs-id-sdk-web";

async function main() {
  console.log("Start prfs embed webapp");

  const messageQueue = new MessageQueue();
  setupStorageListener(messageQueue);
  setupParentMsgHandler(messageQueue);
  await sendMsgToParent(newPrfsIdMsg("HANDSHAKE", {}));
}

main().then();
